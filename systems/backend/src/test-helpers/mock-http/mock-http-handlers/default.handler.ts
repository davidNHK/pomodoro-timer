import { Injectable } from '@nestjs/common';

import type {
  Handler,
  MockContext,
  MockedRequest,
  MockedResponse,
} from './mock.interface';

@Injectable()
export class DefaultHandler implements Handler {
  resolve(_req: MockedRequest, res: MockedResponse, ctx: MockContext) {
    return res(
      ctx.status(501),
      ctx.json({
        errors: [
          {
            message: 'Not implemented',
          },
        ],
      }),
    );
  }
}
