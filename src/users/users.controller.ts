import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/index';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  // Dependency Injection
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  // GET /api/v1/users
  @Get()
  async findAll() {
    const users = await this.repository.find();

    return { success: true, count: users.length, data: users };
  }

  // GET /api/v1/users/:id
  @Get(':id')
  async findOne(@Param('id') id) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return { success: true, data: user };
  }

  // POST /api/v1/users
  @Post()
  async create(@Body() input: CreateUserDto) {
    const user = await this.repository.save({
      ...input,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return { success: true, data: user };
  }

  // PATCH /api/v1/users/:id
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateUserDto) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    const data = await this.repository.save({
      ...user,
      ...input,
      createdAt: input.createdAt ?? user.createdAt,
      updatedAt: input.updatedAt ?? user.updatedAt,
    });

    return { success: true, data };
  }

  // DELETE /api/v1/users/:id
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    await this.repository.remove(user);
  }
}
