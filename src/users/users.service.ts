import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailQueue, User, FailedQueue } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/index';

const arr = [
  {
   id: '68830219-c5be-41f6-9709-637c5b302397',
   first_name: 'Phoenix',
   last_name: 'Wright',
   birthdate: "1999-12-29T17:00:00.000Z",
   location: 'America/Phoenix',
   created_at: "2024-02-28T15:57:55.136Z",
   updated_at: "2024-02-28T15:57:55.136Z"
 },
 {
   id: '42ffa65f-5723-4dc7-86a5-d6c8fdb67e7f',
   first_name: 'Maya',
   last_name: 'Fey',
   birthdate: "2003-12-29T17:00:00.000Z",
   location: 'America/Phoenix',
   created_at: "2024-02-28T15:59:12.433Z",
   updated_at: "2024-02-28T15:59:12.433Z"
 }
]

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(EmailQueue) private readonly emailQueueRepository: Repository<EmailQueue>,
    @InjectRepository(FailedQueue) private readonly failedQueueRepository: Repository<FailedQueue>
  ) {}
  private readonly users: User[] = [];

  async create(input: CreateUserDto) {
    const user = await this.userRepository.save({
      ...input,
      created_at: input.created_at,
      updated_at: input.updated_at,
    });
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(user: User, input: UpdateUserDto) {
    const data = await this.userRepository.save({
      ...user,
      ...input,
      created_at: input.created_at ?? user.created_at,
      updated_at: input.updated_at ?? user.updated_at,
    });
    return data;
  }

  async remove(user: User) {
    await this.userRepository.remove(user);
    return true;
  }

  // --- Email Queue ---

  async readEmailQueue() {
    return await this.emailQueueRepository.find();
  }

  async addEmailQueue(input: CreateUserDto) {
    // const email = await this.emailQueueRepository.save({
    //   ...input,
    // });
    // return email;
  }

  async removeEmailQueue(email: EmailQueue) {
    await this.emailQueueRepository.remove(email);
    return true;
  }

  // --- Failed Queue ---

  async readFailedQueue() {
    return await this.emailQueueRepository.find();
  }

  async addFailedQueue(input: CreateUserDto) {
    // const email = await this.emailQueueRepository.save({
    //   ...input,
    // });
    // return email;
  }

  async removeFailedQueue(email: EmailQueue) {
    await this.emailQueueRepository.remove(email);
    return true;
  }
}
