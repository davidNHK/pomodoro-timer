import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { BadRequestException } from '../error-hanlding/bad-request.exception';
import { ErrorCode } from '../error-hanlding/error-code.constant';
import type { Task, TaskInput } from './task.model';
import { TaskStatus } from './task.model';

@Injectable()
export class TaskService {
  private tasks: { [userId: string]: Task[] } = {};

  private focusedTask: { [userId: string]: Task } = {};

  async getUserFocusedTask({ userId }: { userId: string }) {
    return this.focusedTask[userId];
  }

  async startUserFocusTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) {
    const task = this.tasks?.[userId]?.find(t => t.id === taskId);
    if (!task) {
      throw new BadRequestException({
        code: ErrorCode.ValidationError,
        errors: [{ title: "Task doesn't exist" }],
      });
    }
    task.status = TaskStatus.STARTED;
    this.focusedTask[userId] = task;
    return this.focusedTask[userId];
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.tasks[userId] || [];
  }

  async appendUserTaskList(userId: string, task: TaskInput): Promise<Task> {
    this.tasks[userId] = this.tasks[userId] || [];
    const taskGotoCreate = {
      ...task,
      createdAt: new Date(),
      id: randomUUID(),
      status: TaskStatus.PENDING,
    };
    this.tasks[userId].push(taskGotoCreate);
    return taskGotoCreate;
  }
}
