import { describe, expect, it } from '@jest/globals';
import { TerminusModule } from '@nestjs/terminus';

import { expectResponseCode } from '../test-helpers/expect-response-code';
import { getRequestAgent } from '../test-helpers/get-request-agent';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { HealthModule } from './health.module';

const appContext = withNestServerContext({
  imports: [TerminusModule, HealthModule],
});
describe('GET /healthz', () => {
  it('/healthz (GET)', async () => {
    const app = appContext.app;
    const { body } = await getRequestAgent(app.getHttpServer())
      .get('/healthz')
      .expect(expectResponseCode({ expectedStatusCode: 200 }));
    expect(body).toStrictEqual({
      details: {},
      error: {},
      info: {},
      status: 'ok',
    });
  });
});
