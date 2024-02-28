import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailQueue, User, FailedQueue } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, EmailQueue, FailedQueue])
  ],
  providers: [TasksService, UsersService],
})
export class TasksModule {}
