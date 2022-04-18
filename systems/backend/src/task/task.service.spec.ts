import { describe, expect, it } from '@jest/globals';

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
});
