import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { map } from 'rxjs/operators';

// users DB
const users = [
  '1@gmail.com',
  '2@gmail.com',
  '3@gmail.com',
  '4@gmail.com',
  '5@gmail.com',
  '6@gmail.com',
  '7@gmail.com',
  '8@gmail.com',
  '9@gmail.com'
]
// email_queue DB
const emailQueue = []
// failed_queue DB
const failedQueue = []

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(TasksService.name);

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

  // @Cron('0 * * * *') // At minute 0 (every hour)
  // @Cron('* * * * *') // At every minute
  @Timeout(5000) // Once after 5 seconds
  async getRecipientEmails() {
    this.logger.debug('Retrieving all emails within the timezone...');

    // TODO: Read all emails from DB and insert to email_queue DB
    await this.processQueueEmails();
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


