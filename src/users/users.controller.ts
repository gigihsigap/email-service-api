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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // Dependency Injection
  constructor(
    private readonly usersService: UsersService
  ) {}

  // GET /api/v1/users
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return { success: true, count: users.length, data: users };
  }

  // GET /api/v1/users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return { success: true, data: user };
  }

  // POST /api/v1/users
  @Post()
  async create(@Body() input: CreateUserDto) {
    const user = await this.usersService.create(input);

    return { success: true, data: user };
  }

  // PATCH /api/v1/users/:id
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateUserDto) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    const data = await this.usersService.update(user, input)

    return { success: true, data };
  }

  // DELETE /api/v1/users/:id
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    // const user = await this.repository.findOneBy({ id });
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.usersService.remove(user);
  }
}
