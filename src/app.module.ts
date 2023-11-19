import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoalsController } from './goals/goals.controller';

@Module({
  imports: [],
  controllers: [AppController, GoalsController],
  providers: [AppService],
})
export class AppModule {}
