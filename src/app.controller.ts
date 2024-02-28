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

    const testTimezones = ['America/Phoenix', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Invalid/Timezone'];
    testTimezones.forEach(timezone => {
      console.log(`Timezone ${timezone} is valid: ${isValidTimezone(timezone)}`);
    });

    return this.appService.getHello();
    // return this.userService.getHello();
  }
}
