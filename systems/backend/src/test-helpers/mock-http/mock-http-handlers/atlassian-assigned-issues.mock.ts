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
export class AtlassianAssignedIssuesHandler implements Handler {
  constructor(@Optional() private defaultHandler?: DefaultHandler) {}

  resolve(req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return this.defaultHandler?.resolve(req, res, ctx);
  }

  static fromJestMock(
    mock: jest.MockedFunction<any>,
  ): AtlassianAssignedIssuesHandler {
    return {
      resolve: mock,
    };
  }
}

@Injectable()
export class AtlassianAssignedIssuesMock implements Mock {
  constructor(
    @Optional()
    private readonly atlassianAssignedIssuesHandler: AtlassianAssignedIssuesHandler,
  ) {}

  get mock() {
    return (
      this.atlassianAssignedIssuesHandler &&
      rest.get(
        'https://api.atlassian.com/ex/jira/:cloudId/rest/api/2/issue/picker',
        this.atlassianAssignedIssuesHandler.resolve,
      )
    );
  }
}
