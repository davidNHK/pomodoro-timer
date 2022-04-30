import { Module } from '@nestjs/common';

import { MockHttpService } from './mock-http.service';
import {
  AtlassianAssignedIssuesHandler,
  AtlassianAssignedIssuesMock,
} from './mock-http-handlers/atlassian-assigned-issues.mock';
import {
  AtlassianCurrentUserHandler,
  AtlassianCurrentUserMock,
} from './mock-http-handlers/atlassian-current-user.mock';
import {
  AtlassianRefreshTokenHandler,
  AtlassianRefreshTokenMock,
} from './mock-http-handlers/atlassian-refresh-token.mock';
import {
  AtlassianTokenAccessibleResourcesHandler,
  AtlassianTokenAccessibleResourcesMock,
} from './mock-http-handlers/atlassian-token-accessible-resources.mock';
import { DefaultHandler } from './mock-http-handlers/default.handler';
import { MockHttpHandlersService } from './mock-http-handlers/mock-http-handlers.service';

@Module({
  exports: [
    MockHttpService,
    MockHttpHandlersService,
    AtlassianAssignedIssuesHandler,
    AtlassianRefreshTokenHandler,
    AtlassianTokenAccessibleResourcesHandler,
    AtlassianCurrentUserHandler,
  ],
  providers: [
    DefaultHandler,
    MockHttpService,
    MockHttpHandlersService,
    AtlassianAssignedIssuesHandler,
    AtlassianRefreshTokenHandler,
    AtlassianTokenAccessibleResourcesHandler,
    AtlassianCurrentUserHandler,
    AtlassianAssignedIssuesMock,
    AtlassianCurrentUserMock,
    AtlassianRefreshTokenMock,
    AtlassianTokenAccessibleResourcesMock,
  ],
})
export class MockHttpModule {}
export type { MockHandler } from './mock-http-handlers/mock.interface';
