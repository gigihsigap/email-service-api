import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  // Interval,
  Timeout
} from '@nestjs/schedule';
import * as moment from 'moment-timezone';
// import { map } from 'rxjs/operators';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 * * * *') // Run this function at every minute 0 (every hour)
  async getRecipientEmails() {
    this.logger.debug(`-----[STARTING: Birthday Email Blast]-----`);

    // Read all emails from DB and insert to email_queue DB
    const users = await this.userService.findAll();

    const targetHour = 9; // Target hour to send emails, 9 for birthday email (09.00)
    const currentUtcHour = moment.utc().hour(); // Current hour in UTC
    let offsetHours: number;

    if (currentUtcHour < targetHour) {
      offsetHours = targetHour - currentUtcHour;
    } else if (currentUtcHour > targetHour) {
      offsetHours = -(currentUtcHour - targetHour);
    } else {
      offsetHours = 0;
    }

    const selectedTimezoneOffset = moment().utcOffset(offsetHours * 60).format('Z');

    this.logger.debug(`Selected timezone: ${selectedTimezoneOffset}`)

    const filteredUsers = users.filter((user) => {
      const userTimezoneOffset = moment.tz(user.location).format('Z'); // Get the timezone offset of the user's location
      const userBirthdate = moment(user.birthdate).tz(user.location); // Convert user's birthdate to their timezone
      // console.log(`User's birthday: ${userBirthdate.day()} - ${userBirthdate.month()} | Today's date: ${moment().day()} - ${moment().month()}`)
      const isBirthdayToday = (userBirthdate.day() === moment().day()) && (userBirthdate.month() === moment().month()); // Check for matching day and month
      return (userTimezoneOffset === selectedTimezoneOffset) && isBirthdayToday;
    });

    this.logger.debug(`Number of birthday emails to send: ${filteredUsers.length}`)

    // Write to email_queue table
    await this.userService.addEmailQueue(filteredUsers);

    // Attempt sending email
    await this.processQueueEmails();

    this.logger.debug(`-----[FINISHED: Birthday Email Blast]-----`);
  }

  async processQueueEmails() {
    // Read all emails from email_queue table
    const emails = await this.userService.readEmailQueue()
    this.logger.debug(`Number of emails in active queue: ${emails.length}`)

    const errorList: User[] = [];

    for (const each of emails) {
      const { user } = each;
      try {
        const response = await this.httpService.post('https://email-service.digitalenvision.com.au/send-email', {
          email: user.email_address,
          message: `Hey ${user.first_name} ${user.last_name}, it’s your birthday!`,
        }).toPromise(); // Convert Observable to Promise and await for result

        this.logger.debug(`${response.status} - ${user.email_address}`);

      } catch (error) {
        this.logger.error(`${error?.message} - ${user.email_address}`);
        errorList.push(user);
      }

      // Remove data from email_queue table
      await this.userService.removeEmailQueue(each)
    }

    // If there's any failed API request, write to failed_queue table and trigger processFailedEmails
    if (errorList.length > 0) {
      await this.userService.addFailedQueue(errorList);
      await this.processFailedEmails();
    }
  }

  async processFailedEmails() {
    let attemptCount = 0;
    do {
      // Read all emails from failed_queue table
      const emails = await this.userService.readFailedQueue();
      this.logger.debug(`Number of emails in failed queue: ${emails.length}`);

      const errorList: User[] = [];

      for (const each of [...emails]) {
        const { user } = each;
        try {
          const response = await this.httpService.post('https://email-service.digitalenvision.com.au/send-email', {
            email: user.email_address,
            message: `Hey ${user.first_name} ${user.last_name}, it’s your birthday!`,
          }).toPromise(); // Convert Observable to Promise and await for result
          this.logger.debug(`${response.status} - ${user.email_address}`);

          // If successful, remove data from failed_queue
          await this.userService.removeFailedQueue(each);
        } catch (error) {
          this.logger.error(`${error?.message} - ${user.email_address}`);
          errorList.push(user);
        }
      }

      // If there are failed API requests, add them to failed_queue and retry up to 3 times
      if (errorList.length > 0) {
        await this.userService.addFailedQueue(errorList);
        attemptCount++;
      } else {
        break; // Exit the loop if all emails were sent successfully
      }
    } while (attemptCount < 3);
  }

  @Timeout(5000) // Run once after 5 seconds of bootup, in case of server going down
  async startUpTask() {
    this.logger.debug(`-----[STARTING: Start-up Task]-----`);
    await this.blastPendingEmail();
    this.logger.debug(`-----[FINISHED: Start-up Task]-----`);
  }

  async blastPendingEmail() {
    // Check for remaining failed_queue and resend them all
    await this.processFailedEmails();

    // Check for pending email_queue and send them all
    await this.processQueueEmails();
  }
  
  /*----- Examples -----*/
  
  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}

