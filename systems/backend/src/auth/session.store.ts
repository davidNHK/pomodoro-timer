import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ConnectionProvider } from '../database/connection.provider';

@Injectable()
export class SessionStore {
  // Implement https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/store.js

  constructor(private connection: ConnectionProvider) {}

  memoryStore: {
    [stateId: string]: {
      handle: string;
      meta: unknown;
      state: Record<string, any>;
    };
  } = {};

  async store(
    _req: unknown,
    state: any,
    meta: unknown,
    callback: (err: unknown, stateId?: string) => void,
  ) {
    const stateId = randomUUID();
    try {
      await this.connection.collection('sessions').doc(stateId).set({
        meta,
        state,
      });
      return callback(null, stateId);
    } catch (err) {
      return callback(err);
    }
  }

  async verify(
    _req: unknown,
    stateId: string,
    callback: (err: unknown, valid: boolean, state: any) => void,
  ) {
    const doc = await this.connection.collection('sessions').doc(stateId).get();
    if (!doc.exists) {
      return callback(null, false, {
        message: 'Unable to verify authorization request state.',
      });
    }
    return callback(null, true, doc.data()?.['state']);
  }
}
