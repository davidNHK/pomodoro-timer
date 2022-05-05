import { Injectable } from '@nestjs/common';

import type { Pomodoro } from '../task.model';
import { TaskRepository } from '../task.repository';

type Identifies = { taskId: string; userId: string };

@Injectable()
export class PomodoroRecordRepository {
  constructor(private readonly taskRepository: TaskRepository) {}

  private taskCollection(identifies: Identifies) {
    return this.taskRepository
      .userTaskCollection(identifies.userId)
      .doc(identifies.taskId)
      .collection('pomodoros');
  }

  create(identifies: Identifies, pomodoro: Pomodoro) {
    return this.taskCollection(identifies).doc(pomodoro.id).set(pomodoro);
  }

  async count(identifies: Identifies) {
    const snapshot = await this.taskCollection(identifies).get();
    return snapshot.size;
  }
}
