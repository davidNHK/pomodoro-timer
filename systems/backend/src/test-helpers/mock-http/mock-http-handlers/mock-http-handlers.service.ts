import { Injectable } from '@nestjs/common';
import type { RestHandler } from 'msw';

import { AtlassianAssignedIssuesMock } from './atlassian-assigned-issues.mock';
import { AtlassianCurrentUserMock } from './atlassian-current-user.mock';
import { AtlassianRefreshTokenMock } from './atlassian-refresh-token.mock';
import { AtlassianTokenAccessibleResourcesMock } from './atlassian-token-accessible-resources.mock';

@Injectable()
export class MockHttpHandlersService {
  constructor(
    private readonly atlassianTokenAccessibleResourcesMock: AtlassianTokenAccessibleResourcesMock,
    private readonly atlassianRefreshTokenMock: AtlassianRefreshTokenMock,
    private readonly atlassianCurrentUserMock: AtlassianCurrentUserMock,
    private readonly atlassianAssignedIssuesMock: AtlassianAssignedIssuesMock,
  ) {}

  get handlers() {
    return [
      this.atlassianRefreshTokenMock.mock,
      this.atlassianTokenAccessibleResourcesMock.mock,
      this.atlassianCurrentUserMock.mock,
      this.atlassianAssignedIssuesMock.mock,
    ].filter(mock => !!mock) as RestHandler[];
  }
}
