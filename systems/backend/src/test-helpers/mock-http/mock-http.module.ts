import { Module } from '@nestjs/common';

import { MockHttpService } from './mock-http.service';
import {
  AtlassianRefreshTokenHandler,
  AtlassianRefreshTokenMock,
} from './mock-http-handlers/atlassian-refresh-token.mock';
import {
  AtlassianTokenAccessibleResourcesHandler,
  AtlassianTokenAccessibleResourcesMock,
} from './mock-http-handlers/atlassian-token-accessible-resources.mock';
import { MockHttpHandlersService } from './mock-http-handlers/mock-http-handlers.service';

@Module({
  exports: [
    MockHttpService,
    MockHttpHandlersService,
    AtlassianRefreshTokenHandler,
    AtlassianTokenAccessibleResourcesHandler,
  ],
  providers: [
    MockHttpService,
    MockHttpHandlersService,
    AtlassianRefreshTokenHandler,
    AtlassianRefreshTokenMock,
    AtlassianTokenAccessibleResourcesHandler,
    AtlassianTokenAccessibleResourcesMock,
  ],
})
export class MockHttpModule {}
export type { MockHandler } from './mock-http-handlers/mock.interface';
