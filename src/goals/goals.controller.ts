import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGoalDto, UpdateGoalDto } from './dtos/index';
import { Goal } from './entities/goal.entity';
import { Priority, Status } from './enums/index';

@Controller('goals')
export class GoalsController {
  private goals: Goal[] = [
    {
      id: 1,
      name: 'Learn tRPC',
      priority: Priority.LOW,
      status: Status.TODO,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Learn Nest.js',
      priority: Priority.HIGH,
      status: Status.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  @Get()
  findAll() {
    return this.goals;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const goal = this.goals.find((goal) => goal.id === parseInt(id));

    return goal;
  }

  @Post()
  create(@Body() input: CreateGoalDto) {
    const goal = {
      ...input,
      createdAt: new Date(input.createdAt),
      updatedAt: new Date(input.updatedAt),
      id: this.goals.length + 1,
    };

    this.goals.push(goal);
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateGoalDto) {
    const index = this.goals.findIndex((goal) => goal.id === parseInt(id));

    this.goals[index] = {
      ...this.goals[index],
      ...input,
      createdAt: input.createdAt
        ? new Date(input.createdAt)
        : this.goals[index].createdAt,
      updatedAt: input.updatedAt
        ? new Date(input.updatedAt)
        : this.goals[index].updatedAt,
    };

    return this.goals[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.goals = this.goals.filter((goal) => goal.id !== parseInt(id));
  }
}
