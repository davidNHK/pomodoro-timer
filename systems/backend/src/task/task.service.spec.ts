import { describe, expect, it } from '@jest/globals';

import { BadRequestException } from '../error-hanlding/bad-request.exception';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
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
    const tasks = await service.getUserTasks('testId');
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
    const [task] = await service.getUserTasks('testId');

    await service.startUserFocusTask({
      taskId: task.id,
      userId: 'testId',
    });
    const focusedTask = await service.getUserFocusedTask({ userId: 'testId' });
    expect(focusedTask.id).toEqual(task.id);
  });

  it('should throw error when set user focus tasks with taskId that not exist', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<TaskService>(TaskService);

    await expect(
      service.startUserFocusTask({
        taskId: 'fakeId',
        userId: 'testId',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
