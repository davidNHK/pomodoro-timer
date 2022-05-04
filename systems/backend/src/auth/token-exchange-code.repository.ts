import { Injectable } from '@nestjs/common';

import { ConnectionProvider } from '../database/connection.provider';

@Injectable()
export class TokenExchangeCodeRepository {
  constructor(private connection: ConnectionProvider) {}

  async fineOne(code: string): Promise<any> {
    const snapshot = await this.connection
      .collection('token-exchange-codes')
      .doc(code)
      .get();
    if (!snapshot.exists) return null;
    return snapshot.data();
  }

  async create(code: string, values: { expires: number; userId: string }) {
    return this.connection
      .collection('token-exchange-codes')
      .doc(code)
      .set(values);
  }

  async remove(code: string) {
    return this.connection
      .collection('token-exchange-codes')
      .doc(code)
      .delete();
  }
}
