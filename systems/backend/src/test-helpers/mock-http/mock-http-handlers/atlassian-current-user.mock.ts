import { Injectable, Optional } from '@nestjs/common';
import { rest } from 'msw';

import { DefaultHandler } from './default.handler';
import type {
  Handler,
  Mock,
  MockContext,
  MockedRequest,
  MockedResponse,
} from './mock.interface';

@Injectable()
export class AtlassianCurrentUserHandler implements Handler {
  constructor(@Optional() private defaultHandler?: DefaultHandler) {}

  resolve(req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return this.defaultHandler?.resolve(req, res, ctx);
  }

  static fromJestMock(
    mock: jest.MockedFunction<any>,
  ): AtlassianCurrentUserHandler {
    return {
      resolve: mock,
    };
  }
}

@Injectable()
export class AtlassianCurrentUserMock implements Mock {
  constructor(
    @Optional()
    private readonly atlassianRefreshTokenHandler: AtlassianCurrentUserHandler,
  ) {}

  get mock() {
    return (
      this.atlassianRefreshTokenHandler &&
      rest.get(
        'https://api.atlassian.com/me',
        this.atlassianRefreshTokenHandler.resolve,
      )
    );
  }
}
