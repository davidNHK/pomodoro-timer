import { describe, expect, it } from '@jest/globals';

import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { TaskService } from '../task.service';
import { PomodoroRecordService } from './pomodoro-record.service';

const context = withNestModuleBuilderContext({
  providers: [TaskService, PomodoroRecordService],
});

describe('PomodoroRecordService', () => {
  async function setupTest() {
    const module = await context.moduleBuilder.compile();
    const service = module.get<PomodoroRecordService>(PomodoroRecordService);
    const taskService = module.get<TaskService>(TaskService);
    return { service, taskService };
  }

  it('should increase number of pomodoro when call recordTaskPomodoro', async () => {
    const { service, taskService } = await setupTest();
    const createdTask = await taskService.appendUserTaskList('testId', {
      title: 'taskTitleB',
    });
    await expect(
      service.getNumberOfPomodoroOnTask({
        taskId: createdTask.id,
        userId: 'testId',
      }),
    ).resolves.toEqual(0);
    await taskService.startUserFocusTask({
      taskId: createdTask.id,
      userId: 'testId',
    });
    await service.recordTaskPomodoro({
      taskId: createdTask.id,
      userId: 'testId',
    });
    await expect(
      service.getNumberOfPomodoroOnTask({
        taskId: createdTask.id,
        userId: 'testId',
      }),
    ).resolves.toEqual(1);
  });
});
