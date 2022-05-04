import { Injectable, Optional } from '@nestjs/common';

import { JestTestStateProvider } from '../test-helpers/jest/jest-test-state.provider';
import { InjectFireStore } from './database.constants';
import type { FireStore } from './database.module';

@Injectable()
export class ConnectionProvider {
  constructor(
    @InjectFireStore() private db: FireStore,
    @Optional() private testState?: JestTestStateProvider,
  ) {}

  collection(collectionName: string) {
    if (!this.testState) {
      return this.db.collection(collectionName);
    }
    return this.db
      .collection('test')
      .doc(`test-${this.testState.testId}`)
      .collection(collectionName);
  }
}
