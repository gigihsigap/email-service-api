import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsEmail } from 'class-validator';

@Entity()
@Index(['email_address', 'template'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @PrimaryColumn({ unique: true })
  @IsEmail()
  email_address: string;

  @PrimaryColumn()
  template: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  birthdate: Date;

  @Column()
  location: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity()
export class EmailQueue {
  @CreateDateColumn()
  @PrimaryColumn()
  timestamp: Date;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'email_address', referencedColumnName: 'email_address' }, { name: 'template', referencedColumnName: 'template' }])
  user: User;
}

@Entity()
export class FailedQueue {
  @CreateDateColumn()
  @PrimaryColumn()
  timestamp: Date;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'email_address', referencedColumnName: 'email_address' }, { name: 'template', referencedColumnName: 'template' }])
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
//   created_at: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
