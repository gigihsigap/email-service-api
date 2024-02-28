import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as moment from 'moment-timezone';
// import { UsersService } from './users/users.service';

function isValidTimezone(timezone) {
  console.log("Timezone:", timezone)
  return moment.tz.zone(timezone) !== null;
}
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly userService: UsersService
  ) {}

  @Get()
  getHello(): string {

    // const testTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Invalid/Timezone'];
    // testTimezones.forEach(timezone => {
    //   console.log(`Timezone ${timezone} is valid: ${isValidTimezone(timezone)}`);
    // });

    const users = [
      {
        first_name: "Adam",
        last_name: "Smith",
        birthdate: "1997-09-04",
        location: "Asia/Jakarta"
      },
      {
        first_name: "Hyun",
        last_name: "Dai",
        birthdate: "1997-09-04",
        location: "Asia/Taipei"
      },
      {
        first_name: "Joseph",
        last_name: "Levitt",
        birthdate: "1997-09-04",
        location: "America/Toronto"
      }
    ];

    const selectedTimezoneOffset = '+07:00'; // Example: Selecting '+07:00' hours UTC
    users.forEach((user) => {
      let userTimezoneOffset = moment.tz(user.location).format('Z'); // Get the timezone offset of the user's location
      if (userTimezoneOffset === selectedTimezoneOffset) {
        let time = moment.tz(user.birthdate, user.location);
        let format = time.format();
        console.log("Date:", format);
        console.log("Location:", user.location);
      }
    });
    return this.appService.getHello();
    // return this.userService.getHello();
  }
}
