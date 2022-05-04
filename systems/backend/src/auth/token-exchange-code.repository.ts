import { Injectable } from '@nestjs/common';

import { FireStore, InjectFireStore } from '../database/database.module';

@Injectable()
export class TokenExchangeCodeRepository {
  constructor(@InjectFireStore() private db: FireStore) {}

  async fineOne(code: string): Promise<any> {
    const snapshot = await this.db
      .collection('token-exchange-codes')
      .doc(code)
      .get();
    if (!snapshot.exists) return null;
    return snapshot.data();
  }

  async create(code: string, values: { expires: number; userId: string }) {
    return this.db.collection('token-exchange-codes').doc(code).set(values);
  }

  async remove(code: string) {
    return this.db.collection('token-exchange-codes').doc(code).delete();
  }
}
