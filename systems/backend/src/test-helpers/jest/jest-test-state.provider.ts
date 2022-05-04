import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class JestTestStateProvider {
  private logger = new Logger(JestTestStateProvider.name);

  private randomTestId = randomUUID().replace(/-/g, '');

  get testId() {
    return this.randomTestId;
  }
}
