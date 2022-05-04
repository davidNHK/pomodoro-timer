import { Injectable } from '@nestjs/common';

import type { WhereFilterOp } from '../database/database.module';
import { UserRepository } from '../user/user.repository';
import type { Task, TaskStatus } from './task.model';

type FindOneFilter = {
  taskId: string;
  userId: string;
};

@Injectable()
export class TaskRepository {
  constructor(private userRepository: UserRepository) {}

  private userTaskCollection(userId: string) {
    return this.userRepository.collection.doc(userId).collection('tasks');
  }

  async create(userId: string, task: Task) {
    return this.userTaskCollection(userId).doc(task.id).set(task);
  }

  async update(filter: FindOneFilter, taskUpdate: Partial<Task>) {
    return this.userTaskCollection(filter.userId)
      .doc(filter.taskId)
      .update(taskUpdate);
  }

  async findOne(filter: FindOneFilter) {
    const snapshot = await this.userTaskCollection(filter.userId)
      .doc(filter.taskId)
      .get();
    if (!snapshot.exists) return null;
    return snapshot.data() as Task;
  }

  async findAll(userId: string, queries: { statuses?: TaskStatus[] }) {
    const wheres: [string, WhereFilterOp, string[] | undefined | string][] = [
      ['status', 'in', queries.statuses],
    ];

    let taskRef: any = this.userTaskCollection(userId);
    wheres.forEach(([field, operator, values]) => {
      if (!values) return;
      taskRef = taskRef.where(field, operator, values);
    });
    const snapshot = await taskRef
      .orderBy('startedAt', 'desc')
      .orderBy('createdAt', 'desc')
      .get();
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc: any) => doc.data()) as Task[];
  }
}
