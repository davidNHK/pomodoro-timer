import { Injectable } from '@nestjs/common';
import type { RestHandler } from 'msw';

import { AtlassianRefreshTokenMock } from './atlassian-refresh-token.mock';
import { AtlassianTokenAccessibleResourcesMock } from './atlassian-token-accessible-resources.mock';

@Injectable()
export class MockHttpHandlersService {
  constructor(
    private readonly atlassianTokenAccessibleResourcesMock: AtlassianTokenAccessibleResourcesMock,
    private readonly atlassianRefreshTokenMock: AtlassianRefreshTokenMock,
  ) {}

  get handlers() {
    return [
      this.atlassianTokenAccessibleResourcesMock.mock,
      this.atlassianRefreshTokenMock.mock,
    ].filter(mock => !!mock) as RestHandler[];
  }
}
