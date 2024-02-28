import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EmailQueue, User, FailedQueue } from './users/entities/user.entity';
import { UserController } from './users/user.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { UserService } from './users/user.service';
// import { UserService } from './users/users.service';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([User, EmailQueue, FailedQueue])
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

// @Module({
//   imports: [ScheduleModule.forRoot(), TasksModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}