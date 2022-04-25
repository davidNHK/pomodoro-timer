import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type { User } from './user.model';

type UserStore = Omit<User, 'connectedProviders'>;

@Injectable()
export class UserService {
  private users: { [userId: string]: UserStore } = {};

  async createUser(user: Omit<UserStore, 'id' | 'createdAt'>) {
    const userId = randomUUID();
    this.users[userId] = {
      ...user,
      createdAt: new Date(),
      id: userId,
    };
    return userId;
  }

  async getUser(userId: string) {
    return this.users[userId];
  }

  async isUserIdExist(userId: string) {
    return !!this.users[userId];
  }
}
