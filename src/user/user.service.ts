import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailQueue, User, FailedQueue } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/index';

@Injectable()
export class UserService {
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
    return await this.emailQueueRepository.find({ relations: ['user'] });
  }

  async addEmailQueue(input: User[]) {
    const emailQueues = input.map(user => {
      const emailQueue = new EmailQueue();
      emailQueue.user = user;
      return emailQueue;
    });

    const savedEmailQueues = await this.emailQueueRepository.save(emailQueues);
    return savedEmailQueues;
  }

  async removeEmailQueue(email: EmailQueue) {
    await this.emailQueueRepository.remove(email);
    return true;
  }

  // --- Failed Queue ---

  async readFailedQueue() {
    return await this.failedQueueRepository.find({ relations: ['user'] });
  }

  async addFailedQueue(input: User[]) {
    const failedQueues = input.map(user => {
      const failedQueue = new FailedQueue();
      failedQueue.user = user;
      return failedQueue;
    });

    const savedFailedQueues = await this.failedQueueRepository.save(failedQueues);
    return savedFailedQueues;
  }

  async removeFailedQueue(email: EmailQueue) {
    await this.failedQueueRepository.remove(email);
    return true;
  }
}
