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
import { CreateUserDto, UpdateUserDto } from './dtos/index';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

   // GET /api/v1/user/:id
   @Get('/queue')
   async findAllEmailQueue() {
     const user = await this.userService.readEmailQueue();
     return { success: true, data: user };
   }

   // GET /api/v1/user/:id
   @Get('/failed')
   async findAllFailedQueue() {
     const user = await this.userService.readFailedQueue();
     return { success: true, data: user };
   }

  // GET /api/v1/users
  @Get('/')
  async findAll() {
    const users = await this.userService.findAll();

    return { success: true, count: users.length, data: users };
  }

  // GET /api/v1/users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    return { success: true, data: user };
  }

  // POST /api/v1/users
  @Post()
  async create(@Body() input: CreateUserDto) {
    const user = await this.userService.create(input);

    return { success: true, data: user };
  }

  // PATCH /api/v1/users/:id
  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateUserDto) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    const data = await this.userService.update(user, input)

    return { success: true, data };
  }

  // DELETE /api/v1/users/:id
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    // const user = await this.repository.findOneBy({ id });
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.remove(user);
  }
}
