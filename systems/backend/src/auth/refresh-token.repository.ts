import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';

@Injectable()
export class RefreshTokenRepository {
  constructor(private userRepository: UserRepository) {}

  get collection() {
    return this.userRepository.collection;
  }

  async create(userId: string, tokens: { refreshToken: string }) {
    return this.collection.doc(userId).update(tokens);
  }

  async findOne(userId: string) {
    const snapshot = await this.collection.doc(userId).get();
    if (!snapshot.exists) {
      return null;
    }
    return {
      refreshToken: snapshot.data()?.['refreshToken'],
    };
  }
}
