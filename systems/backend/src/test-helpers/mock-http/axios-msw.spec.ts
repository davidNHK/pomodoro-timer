import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import axios from 'axios';
import { rest } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';

import type {
  MockContext,
  MockedRequest,
  MockedResponse,
} from './mock-http-handlers/mock.interface';

describe('Integrate axios and msw', () => {
  let server: SetupServerApi;
  beforeAll(async () => {
    server = setupServer(
      rest.post(
        'https://auth.atlassian.com/oauth/token',
        (_req: MockedRequest, res: MockedResponse, ctx: MockContext) => {
          return res(
            ctx.status(200),
            ctx.json({
              access_token: 'newAccessToken',
              refresh_token: 'newRefreshToken',
            }),
          );
        },
      ),
    );
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should get mocked response', async () => {
    const res = await axios.post(
      'https://auth.atlassian.com/oauth/token',
      {
        client_id: 'clientId',
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    expect(res.data).toStrictEqual({
      access_token: 'newAccessToken',
      refresh_token: 'newRefreshToken',
    });
  });
});
