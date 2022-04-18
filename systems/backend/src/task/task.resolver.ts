import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { TokenUserPayload } from '../auth/token-user-payload';
import { User } from '../auth/user.decorator';
import { Task, TaskInput } from './task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [Task])
  @UseGuards(JwtAuthGuard)
  async tasks(@User() user: TokenUserPayload) {
    return this.taskService.getUserTasks(user.userId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @User() user: TokenUserPayload,
    @Args('data') data: TaskInput,
  ) {
    return this.taskService.appendUserTaskList(user.userId, data);
  }
}
