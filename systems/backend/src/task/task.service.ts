import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { NotFoundException } from '../error-hanlding/not-found.exception';
import { FocusedTaskRepository } from './focused-task.repository';
import type { Task, TaskInput } from './task.model';
import { TaskStatus } from './task.model';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private focusedTaskRepository: FocusedTaskRepository,
  ) {}

  async getTask({ taskId, userId }: { taskId: string; userId: string }) {
    return this.taskRepository.findOne({ taskId, userId });
  }

  async finishUserFocusingTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) {
    const task = await this.taskRepository.findOne({ taskId, userId });
    if (!task) {
      throw new NotFoundException({
        code: ErrorCode.TaskNotFoundError,
        errors: [{ title: "Task doesn't exist" }],
      });
    }
    await this.taskRepository.update(
      { taskId, userId },
      { status: TaskStatus.DONE },
    );
    await this.focusedTaskRepository.remove(userId);
    return task;
  }

  async getUserFocusedTask({ userId }: { userId: string }) {
    const taskId = await this.focusedTaskRepository.findOne(userId);
    if (!taskId) return null;
    return await this.taskRepository.findOne({ taskId, userId });
  }

  async startUserFocusTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) {
    const task = await this.taskRepository.findOne({ taskId, userId });
    if (!task) {
      throw new NotFoundException({
        code: ErrorCode.TaskNotFoundError,
        errors: [{ title: "Task doesn't exist" }],
      });
    }
    await this.taskRepository.update(
      { taskId, userId },
      { startedAt: new Date(), status: TaskStatus.STARTED },
    );
    await this.focusedTaskRepository.create(userId, taskId);
    return task;
  }

  async getUserTasks(
    userId: string,
    {
      statuses,
    }: {
      statuses?: TaskStatus[];
    },
  ): Promise<Task[]> {
    return this.taskRepository.findAll(userId, {
      statuses,
    });
  }

  async appendUserTaskList(userId: string, task: TaskInput): Promise<Task> {
    const taskGotoCreate = {
      ...task,
      createdAt: new Date(),
      id: randomUUID(),
      startedAt: null,
      status: TaskStatus.PENDING,
    };
    await this.taskRepository.create(userId, taskGotoCreate);
    return taskGotoCreate;
  }
}
