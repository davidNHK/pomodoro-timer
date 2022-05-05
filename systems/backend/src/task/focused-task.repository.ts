import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';

@Injectable()
export class FocusedTaskRepository {
  constructor(private userRepository: UserRepository) {}

  private userCollection(userId: string) {
    return this.userRepository.collection.doc(userId);
  }

  async create(userId: string, taskId: string) {
    return this.userCollection(userId).update({
      focusedTaskId: taskId,
    });
  }

  async findOne(userId: string) {
    const snapshot = await this.userCollection(userId).get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data()?.['focusedTaskId'];
  }

  async remove(userId: string) {
    return this.userCollection(userId).update({
      focusedTaskId: null,
    });
  }
}
