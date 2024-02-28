import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/users/users.service';

// users DB
// const users = [
//   '1@gmail.com',
//   '2@gmail.com',
//   '3@gmail.com',
//   '4@gmail.com',
//   '5@gmail.com',
//   '6@gmail.com',
//   '7@gmail.com',
//   '8@gmail.com',
//   '9@gmail.com'
// ]
// email_queue DB
const emailQueue = []
// failed_queue DB
const failedQueue = []

@Injectable()
export class TasksService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  // @Timeout(5000) // Once after 5 seconds
  // @Cron('* * * * *') // At every minute
  @Cron('0 * * * *') // At minute 0 (every hour)
  async getRecipientEmails() {
    this.logger.debug('Retrieving all emails within the timezone...');

    // TODO: Read all emails from DB and insert to email_queue DB
    const users = await this.usersService.findAll();

    const targetHour = 9; // Target hour to send emails
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
    // const selectedTimezoneOffset = '+09:00'; // Example: Selecting '+07:00' hours UTC

    console.log("currentUtcHour", currentUtcHour)
    console.log("selectedTimezoneOffset", selectedTimezoneOffset)

    const filteredUsers = users.filter((user) => {
      let userTimezoneOffset = moment.tz(user.location).format('Z'); // Get the timezone offset of the user's location
      return userTimezoneOffset === selectedTimezoneOffset;
    });

    console.log("Filtered user:", filteredUsers)

    // filteredUsers.forEach((user) => {
    //   let time = moment.tz(user.birthdate, user.location);
    //   let format = time.format();
    // });

    await this.processQueueEmails();
  }

  async processQueueEmails() {
    // TODO: Read all emails from email_queue table
    const emails = emailQueue;
    const errorEmails = [];

    for (const [id, email] of emails.entries()) {
      this.logger.debug(`Sending email ${email}... ${id}`);
      try {
        const response = await this.httpService.post('https://email-service.digitalenvision.com.au/send-email', {
          email: "test@digitalenvision.com.au",
          message: 'Hi, nice to meet you.',
        }).toPromise(); // Convert Observable to Promise and await for result
        console.log("Successful sending email:", email);

      } catch (error) {
        console.log("Error sending email:", email)
        errorEmails.push(email);
      }

      // TODO: Remove data from emailQueue
      console.log("Removing from queue...", email)
    }

    if (errorEmails.length > 0) this.queueFailedEmails(errorEmails) 
  }

  async processFailedEmails() {
    // TODO: Read all emails from failed_queue table
    const emails = failedQueue;
    const errorEmails = [];
  }
  

  async queueFailedEmails(emails: Array<any>) {
    // TODO: Write all emails at once to failedQueue, no need to do loop
    console.log("Writing emails to failedQueue table:", emails)
  }

  

  
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


