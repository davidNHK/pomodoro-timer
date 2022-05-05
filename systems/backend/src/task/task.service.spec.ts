import { describe, expect, it } from '@jest/globals';

import { DatabaseModule } from '../database/database.module';
import { NotFoundException } from '../error-hanlding/not-found.exception';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { FocusedTaskRepository } from './focused-task.repository';
import { TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

const context = withNestModuleBuilderContext({
  imports: [UserModule, DatabaseModule.forFeature()],
  providers: [TaskRepository, FocusedTaskRepository, TaskService],
});

describe('TaskService', () => {
  it('should append task to user task list', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<TaskService>(TaskService);
    await service.appendUserTaskList('testId', {
      title: 'taskTitleA',
    });
    await service.appendUserTaskList('testId', {
      title: 'taskTitleB',
    });
    const tasks = await service.getUserTasks('testId', {
      statuses: [TaskStatus.PENDING],
    });
    expect(tasks.length).toEqual(2);
  });

  it('should set user focus tasks', async () => {
    const module = await context.moduleBuilder.compile();
    const userService = module.get<UserService>(UserService);
    const service = module.get<TaskService>(TaskService);

    const user = await userService.createUser({
      email: 'test@gmail.com',
      name: 'Testing',
    });
    await service.appendUserTaskList(user.id, {
      title: 'taskTitleA',
    });
    await service.appendUserTaskList(user.id, {
      title: 'taskTitleB',
    });
    const [task] = await service.getUserTasks(user.id, {
      statuses: [TaskStatus.PENDING],
    });

    await service.startUserFocusTask({
      taskId: task.id,
      userId: user.id,
    });
    const focusedTask = await service.getUserFocusedTask({ userId: user.id });
    expect(focusedTask?.id).toEqual(task.id);
  });

  it('should throw error when set user focus tasks with taskId that not exist', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<TaskService>(TaskService);

    await expect(
      service.startUserFocusTask({
        taskId: 'fakeId',
        userId: 'testId',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
