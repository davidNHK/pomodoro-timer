import { describe, expect, it, jest } from '@jest/globals';
import axios from 'axios';

import { withNestModuleBuilderContext } from '../../nest-app-context';
import { MockHttpModule } from '../mock-http.module';
import { AtlassianRefreshTokenHandler } from './atlassian-refresh-token.mock';

const context = withNestModuleBuilderContext({
  imports: [MockHttpModule],
});

describe('Integrate AtlassianRefreshTokenHandler', () => {
  it('should get mocked response', async () => {
    await context.moduleBuilder
      .overrideProvider(AtlassianRefreshTokenHandler)
      .useValue(
        AtlassianRefreshTokenHandler.fromJestMock(
          jest.fn().mockImplementation((_, res: any, ctx: any) => {
            return res(
              ctx.status(200),
              ctx.json({
                access_token: 'newAccessToken',
                refresh_token: 'newRefreshToken',
              }),
            );
          }),
        ),
      )
      .compile();
    const res = await axios.post('https://auth.atlassian.com/oauth/token');
    expect(res.data).toStrictEqual({
      access_token: 'newAccessToken',
      refresh_token: 'newRefreshToken',
    });
  });
});
