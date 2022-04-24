import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { TokenUserPayload } from '../auth/token-user-payload';
import { User } from '../auth/user.decorator';
import { PomodoroRecordService } from './pomodoro-record/pomodoro-record.service';
import {
  Pomodoro,
  QueryTasksFilterInput,
  Task,
  TaskInput,
  TaskStatus,
} from './task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly pomodoroService: PomodoroRecordService,
  ) {}

  @Query(() => [Task])
  @UseGuards(JwtAuthGuard)
  async tasks(
    @User() user: TokenUserPayload,
    @Args('filter', { nullable: true }) filter?: QueryTasksFilterInput,
  ) {
    return this.taskService.getUserTasks(user.userId, {
      statuses: filter?.statuses,
    });
  }

  @Query(() => [Task])
  @UseGuards(JwtAuthGuard)
  async todo(@User() user: TokenUserPayload) {
    return this.taskService.getUserTasks(user.userId, {
      statuses: [TaskStatus.STARTED, TaskStatus.PENDING],
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

  @Mutation(() => Pomodoro)
  @UseGuards(JwtAuthGuard)
  async recordPomodoro(
    @User() user: TokenUserPayload,
    @Args({ name: 'taskId', type: () => ID }) taskId: string,
  ) {
    return this.pomodoroService.recordTaskPomodoro({
      taskId,
      userId: user.userId,
    });
  }

  @ResolveField('completedPomodoro')
  async completedPomodoro(
    @User() user: TokenUserPayload,
    @Parent() task: Task,
  ) {
    return this.pomodoroService.getNumberOfPomodoroOnTask({
      taskId: task.id,
      userId: user.userId,
    });
  }
}
