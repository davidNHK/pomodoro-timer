import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JestTestStateProvider } from '../test-helpers/jest/jest-test-state.provider';
import { InjectFireStore } from './database.constants';
import type { FireStore } from './database.module';

@Injectable()
export class ConnectionProvider {
  constructor(
    @InjectFireStore() private db: FireStore,
    private config: ConfigService,
    @Optional() private testState?: JestTestStateProvider,
  ) {}

  collection(collectionName: string) {
    if (!this.testState) {
      return this.db
        .collection('pomodoro-timers')
        .doc(this.config.get('env')!)
        .collection(collectionName);
    }
    return this.db
      .collection('test')
      .doc(`test-${this.testState.testId}`)
      .collection(collectionName);
  }
}
