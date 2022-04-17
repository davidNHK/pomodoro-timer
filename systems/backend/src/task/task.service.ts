import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type { Task, TaskInput } from './task.model';

@Injectable()
export class TaskService {
  private tasks: { [userId: string]: Task[] } = {};

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.tasks[userId] || [];
  }

  async appendUserTaskList(userId: string, task: TaskInput): Promise<Task> {
    this.tasks[userId] = this.tasks[userId] || [];
    const taskGotoCreate = {
      ...task,
      createdAt: new Date(),
      id: randomUUID(),
    };
    this.tasks[userId].push(taskGotoCreate);
    return taskGotoCreate;
  }
}
