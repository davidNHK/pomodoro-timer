import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { TokenUserPayload } from '../auth/token-user-payload';
import { User } from '../auth/user.decorator';
import { QueryTasksFilterInput, Task, TaskInput } from './task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [Task])
  @UseGuards(JwtAuthGuard)
  async tasks(
    @User() user: TokenUserPayload,
    @Args('filter') filter: QueryTasksFilterInput,
  ) {
    return this.taskService.getUserTasks(user.userId, {
      statuses: filter.statuses,
    });
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @User() user: TokenUserPayload,
    @Args('data') data: TaskInput,
  ) {
    return this.taskService.appendUserTaskList(user.userId, data);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async focusOnTask(
    @User() user: TokenUserPayload,
    @Args({ name: 'taskId', type: () => ID }) taskId: string,
  ) {
    return this.taskService.startUserFocusTask({
      taskId: taskId,
      userId: user.userId,
    });
  }

  @Query(() => Task, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async taskOnFocus(@User() user: TokenUserPayload) {
    return this.taskService.getUserFocusedTask({
      userId: user.userId,
    });
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async finishFocusingTask(
    @User() user: TokenUserPayload,
    @Args({ name: 'taskId', type: () => ID }) taskId: string,
  ) {
    return this.taskService.finishUserFocusingTask({
      taskId,
      userId: user.userId,
    });
  }
}
