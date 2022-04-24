import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { NotFoundException } from '../error-hanlding/not-found.exception';
import type { Task, TaskInput } from './task.model';
import { TaskStatus } from './task.model';

@Injectable()
export class TaskService {
  private tasks: { [userId: string]: Task[] } = {};

  private focusedTask: { [userId: string]: Task | null } = {};

  async getTask({ taskId, userId }: { taskId: string; userId: string }) {
    return this.tasks[userId]?.find(task => task.id === taskId);
  }

  async finishUserFocusingTask({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) {
    const task = this.tasks[userId].find(task => task.id === taskId);
    if (!task) {
      throw new NotFoundException({
        code: ErrorCode.TaskNotFoundError,
        errors: [{ title: "Task doesn't exist" }],
      });
    }
    task.status = TaskStatus.DONE;
    this.focusedTask[userId] = null;
    return task;
  }

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
      throw new NotFoundException({
        code: ErrorCode.TaskNotFoundError,
        errors: [{ title: "Task doesn't exist" }],
      });
    }
    task.status = TaskStatus.STARTED;
    task.startedAt = new Date();
    this.focusedTask[userId] = task;
    return this.focusedTask[userId];
  }

  async getUserTasks(
    userId: string,
    {
      statuses,
    }: {
      statuses?: TaskStatus[];
    },
  ): Promise<Task[]> {
    return (this.tasks[userId] || []).filter(task => {
      return statuses?.includes(task.status) ?? true;
    });
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
