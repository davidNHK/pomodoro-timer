import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionStore {
  // Implement https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/store.js

  memoryStore: {
    [stateId: string]: {
      handle: string;
      meta: unknown;
      state: Record<string, any>;
    };
  } = {};

  store(
    _req: unknown,
    state: any,
    meta: unknown,
    callback: (err: unknown, stateId: string) => void,
  ) {
    const stateId = randomUUID();
    this.memoryStore[stateId] = { handle: stateId, meta, state };
    callback(null, stateId);
  }

  verify(
    _req: unknown,
    stateId: string,
    callback: (err: unknown, valid: boolean, state: any) => void,
  ) {
    if (!this.memoryStore[stateId]) {
      return callback(null, false, {
        message: 'Unable to verify authorization request state.',
      });
    }
    return callback(null, true, this.memoryStore[stateId].state);
  }
}
