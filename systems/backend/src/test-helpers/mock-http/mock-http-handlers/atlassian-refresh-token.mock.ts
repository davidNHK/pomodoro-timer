import { Injectable } from '@nestjs/common';
import { rest } from 'msw';

import type {
  Handler,
  Mock,
  MockContext,
  MockedRequest,
  MockedResponse,
} from './mock.interface';

@Injectable()
export class AtlassianRefreshTokenHandler implements Handler {
  resolve(_req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return res(ctx.json({}));
  }
}

@Injectable()
export class AtlassianRefreshTokenMock implements Mock {
  constructor(
    private readonly atlassianRefreshTokenHandler: AtlassianRefreshTokenHandler,
  ) {}

  get mock() {
    return rest.post(
      'https://auth.atlassian.com/oauth/token',
      this.atlassianRefreshTokenHandler.resolve,
    );
  }
}
