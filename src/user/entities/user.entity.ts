import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import * as moment from 'moment-timezone';
import { IsEmail } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

@Entity('user')
@Unique(['email_address', 'template'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @IsEmail()
  email_address: string;

  @Column({
    nullable: false,
    default: "Birthday"
  })
  template: string

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false })
  birthdate: Date;

  @Column({
    nullable: false,
    transformer: {
      to(value) {
        if (!value) return "Asia/Jakarta"; // Default value
        if (!isValidTimezone(value)) {
          throw new HttpException('Invalid timezone', HttpStatus.BAD_REQUEST);
        }
        return value;
      },
      from(value) {
        return value;
      },
    },
  })
  location: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('email_queue')
export class EmailQueue {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.email_address)
  @JoinColumn({ name: 'id' })
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}

@Entity('failed_queue')
export class FailedQueue {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, user => user.email_address)
  @JoinColumn({ name: 'id' })
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}

function isValidTimezone(timezone) {
  return moment.tz.zone(timezone) !== null;
}