import { describe, expect, it } from '@jest/globals';

import { DatabaseModule } from '../../database/database.module';
import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/user.service';
import { FocusedTaskRepository } from '../focused-task.repository';
import { TaskRepository } from '../task.repository';
import { TaskService } from '../task.service';
import { PomodoroRecordRepository } from './pomodoro-record.repository';
import { PomodoroRecordService } from './pomodoro-record.service';

const context = withNestModuleBuilderContext({
  imports: [UserModule, DatabaseModule.forFeature()],
  providers: [
    TaskRepository,
    FocusedTaskRepository,
    PomodoroRecordRepository,
    TaskService,
    PomodoroRecordService,
  ],
});

describe('PomodoroRecordService', () => {
  async function setupTest() {
    const module = await context.moduleBuilder.compile();
    const service = module.get<PomodoroRecordService>(PomodoroRecordService);
    const taskService = module.get<TaskService>(TaskService);
    const userService = module.get<UserService>(UserService);
    return { service, taskService, userService };
  }

  it('should increase number of pomodoro when call recordTaskPomodoro', async () => {
    const { service, taskService, userService } = await setupTest();
    const user = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test user',
    });
    const createdTask = await taskService.appendUserTaskList(user.id, {
      title: 'taskTitleB',
    });
    await expect(
      service.getNumberOfPomodoroOnTask({
        taskId: createdTask.id,
        userId: user.id,
      }),
    ).resolves.toEqual(0);
    await taskService.startUserFocusTask({
      taskId: createdTask.id,
      userId: user.id,
    });
    await service.recordTaskPomodoro({
      taskId: createdTask.id,
      userId: user.id,
    });
    await expect(
      service.getNumberOfPomodoroOnTask({
        taskId: createdTask.id,
        userId: user.id,
      }),
    ).resolves.toEqual(1);
  });
});
