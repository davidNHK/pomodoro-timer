import { Injectable, Logger, Optional } from '@nestjs/common';
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
export class AtlassianRefreshTokenHandler implements Handler {
  constructor(@Optional() private defaultHandler?: DefaultHandler) {}

  resolve(req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return this.defaultHandler?.resolve(req, res, ctx);
  }

  static fromJestMock(
    mock: jest.MockedFunction<any>,
  ): AtlassianRefreshTokenHandler {
    return {
      resolve: mock,
    };
  }
}

@Injectable()
export class AtlassianRefreshTokenMock implements Mock {
  private logger = new Logger(AtlassianRefreshTokenMock.name);

  constructor(
    @Optional()
    private readonly atlassianRefreshTokenHandler: AtlassianRefreshTokenHandler,
  ) {}

  get mock() {
    return (
      this.atlassianRefreshTokenHandler &&
      rest.post(
        'https://auth.atlassian.com/oauth/token',
        this.atlassianRefreshTokenHandler.resolve,
      )
    );
  }
}
