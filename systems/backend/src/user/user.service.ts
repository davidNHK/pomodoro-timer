import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type { User } from './user.model';
import { UserRepository } from './user.repository';

type UserStore = Omit<User, 'connectedProviders'>;

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: Omit<UserStore, 'id' | 'createdAt'>) {
    const userId = randomUUID();
    const record = {
      ...user,
      createdAt: new Date(),
      id: userId,
    };
    await this.userRepository.create(record);
    return record;
  }

  async getUser(userId: string) {
    return this.userRepository.findOne(userId);
  }

  async isUserIdExist(userId: string) {
    return this.userRepository.exist(userId);
  }
}
