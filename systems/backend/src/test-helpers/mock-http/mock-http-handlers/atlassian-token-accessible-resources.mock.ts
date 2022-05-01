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
export class AtlassianTokenAccessibleResourcesHandler implements Handler {
  constructor(@Optional() private defaultHandler?: DefaultHandler) {}

  resolve(req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return this.defaultHandler?.resolve(req, res, ctx);
  }

  static fromJestMock(
    mock: jest.MockedFunction<any>,
  ): AtlassianTokenAccessibleResourcesHandler {
    return {
      resolve: mock,
    };
  }
}

@Injectable()
export class AtlassianTokenAccessibleResourcesMock implements Mock {
  constructor(
    @Optional()
    private readonly atlassianTokenAccessibleResourcesHandler?: AtlassianTokenAccessibleResourcesHandler,
  ) {}

  get mock() {
    return (
      this.atlassianTokenAccessibleResourcesHandler &&
      rest.get(
        'https://api.atlassian.com/oauth/token/accessible-resources',
        this.atlassianTokenAccessibleResourcesHandler.resolve,
      )
    );
  }
}
