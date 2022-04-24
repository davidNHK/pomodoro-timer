import { describe, expect, it } from '@jest/globals';

import { NotFoundException } from '../error-hanlding/not-found.exception';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { TaskStatus } from './task.model';
import { TaskService } from './task.service';

const context = withNestModuleBuilderContext({
  providers: [TaskService],
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
    const service = module.get<TaskService>(TaskService);

    await service.appendUserTaskList('testId', {
      title: 'taskTitleA',
    });
    await service.appendUserTaskList('testId', {
      title: 'taskTitleB',
    });
    const [task] = await service.getUserTasks('testId', {
      statuses: [TaskStatus.PENDING],
    });

    await service.startUserFocusTask({
      taskId: task.id,
      userId: 'testId',
    });
    const focusedTask = await service.getUserFocusedTask({ userId: 'testId' });
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
