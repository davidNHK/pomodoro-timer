import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../../error-hanlding/error-code.constant';
import { NotFoundException } from '../../error-hanlding/not-found.exception';
import type { Pomodoro } from '../task.model';
import { TaskStatus } from '../task.model';
import { TaskService } from '../task.service';

@Injectable()
export class PomodoroRecordService {
  pomodoroRecords: {
    [userId: string]: {
      [taskId: string]: Pomodoro[];
    };
  } = {};

  constructor(private taskService: TaskService) {}

  async getNumberOfPomodoroOnTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }): Promise<number> {
    return this.pomodoroRecords?.[userId]?.[taskId]?.length ?? 0;
  }

  async recordTaskPomodoro({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) {
    const task = await this.taskService.getTask({ taskId, userId });
    if (!task || task.status !== TaskStatus.STARTED) {
      throw new NotFoundException({
        code: ErrorCode.TaskNotFoundError,
        errors: [{ title: 'Task not found!' }],
      });
    }
    this.pomodoroRecords[userId] = this.pomodoroRecords[userId] || {};
    this.pomodoroRecords[userId][taskId] =
      this.pomodoroRecords[userId][taskId] || [];
    const pomodoro: Pomodoro = {
      completeAt: new Date(),
      id: randomUUID(),
      startAt: task.startedAt!,
      taskId,
      userId,
    };
    this.pomodoroRecords[userId][taskId].push(pomodoro);
    return pomodoro;
  }
}
