import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../../error-hanlding/error-code.constant';
import { NotFoundException } from '../../error-hanlding/not-found.exception';
import type { Pomodoro } from '../task.model';
import { TaskStatus } from '../task.model';
import { TaskService } from '../task.service';
import { PomodoroRecordRepository } from './pomodoro-record.repository';

@Injectable()
export class PomodoroRecordService {
  constructor(
    private taskService: TaskService,
    private pomodoroRecordRepository: PomodoroRecordRepository,
  ) {}

  async getNumberOfPomodoroOnTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }): Promise<number> {
    return this.pomodoroRecordRepository.count({ taskId, userId });
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
    const pomodoro: Pomodoro = {
      completeAt: new Date(),
      id: randomUUID(),
      startAt: task.startedAt!,
      taskId,
      userId,
    };
    await this.pomodoroRecordRepository.create({ taskId, userId }, pomodoro);
    return pomodoro;
  }
}
