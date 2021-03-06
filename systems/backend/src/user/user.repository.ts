import { Injectable } from '@nestjs/common';

import { ConnectionProvider } from '../database/connection.provider';
import type { User } from './user.model';

type UserStore = Omit<User, 'connectedProviders'>;

@Injectable()
export class UserRepository {
  constructor(private connection: ConnectionProvider) {}

  get collection() {
    return this.connection.collection('users');
  }

  async create(user: UserStore) {
    await this.collection.doc(user.id).set(user);
  }

  async exist(id: string) {
    return (await this.findOne(id)) !== null;
  }

  async findOne(id: string) {
    const snapshot = await this.collection.doc(id).get();
    if (!snapshot.exists) return null;
    return snapshot.data() as UserStore;
  }
}
