import { describe, expect, it } from '@jest/globals';

import { createRequestAgent } from '../test-helpers/create-request-agent';
import { expectResponseCode } from '../test-helpers/expect-response-code';
import { withNestServerContext } from '../test-helpers/nest-app-context';

const appContext = withNestServerContext({
  imports: [],
});

describe('Auth Module', () => {
  it('should throw error when given code not exist', async () => {
    const resp = await createRequestAgent(appContext.app.getHttpServer())
      .post('/auth/token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send(
        new URLSearchParams({
          code: '123',
          grant_type: 'authorization_code',
        }).toString(),
      )
      .expect(expectResponseCode({ expectedStatusCode: 401 }));
    expect(resp.body.code).toStrictEqual('ERR_EXCHANGE_CODE');
  });

  it('should throw error when given refresh token is invalid', async () => {
    const resp = await createRequestAgent(appContext.app.getHttpServer())
      .post('/auth/token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send(
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: 'www',
        }).toString(),
      )
      .expect(expectResponseCode({ expectedStatusCode: 401 }));
    expect(resp.body.code).toStrictEqual('ERR_REFRESH_TOKEN');
  });
});
