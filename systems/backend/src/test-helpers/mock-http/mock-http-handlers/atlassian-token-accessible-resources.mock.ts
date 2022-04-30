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
export class AtlassianTokenAccessibleResourcesHandler implements Handler {
  resolve(_req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return res(ctx.json({}));
  }
}

@Injectable()
export class AtlassianTokenAccessibleResourcesMock implements Mock {
  constructor(
    private readonly atlassianTokenAccessibleResourcesHandler: AtlassianTokenAccessibleResourcesHandler,
  ) {}

  get mock() {
    return rest.get(
      'https://api.atlassian.com/oauth/token/accessible-resources',
      this.atlassianTokenAccessibleResourcesHandler.resolve,
    );
  }
}
