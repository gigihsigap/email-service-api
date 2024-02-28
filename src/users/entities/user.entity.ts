import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  birthdate: Date;

  @Column()
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class EmailQueue {
  @PrimaryColumn()
  email_address: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'email_address' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity()
export class FailedQueue {
  @PrimaryColumn()
  @CreateDateColumn()
  timestamp: Date;

  @PrimaryColumn()
  email_address: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'email_address' })
  user: User;
}


// @Entity()
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: number;

//   @Column()
//   name: string;

//   @Column({
//     type: 'enum',
//     enum: Status,
//     default: Status.PENDING,
//   })
//   status: Status;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
