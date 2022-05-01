import { describe, expect, it, jest } from '@jest/globals';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { lastValueFrom } from 'rxjs';

import {
  AtlassianCurrentUserHandler,
  AtlassianRefreshTokenHandler,
} from '../test-helpers/mock-http';
import { MockHttpModule } from '../test-helpers/mock-http/mock-http.module';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { UserProvider } from '../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../user/connected-provider/connected-provider.service';
import { UserModule } from '../user/user.module';
import { AtlassianTokenService } from './atlassian.strategy';

const context = withNestModuleBuilderContext({
  imports: [ConfigModule, HttpModule, UserModule, MockHttpModule],
  providers: [AtlassianTokenService],
});

describe('AtlassianTokenService', () => {
  async function setupTest(module: TestingModule) {
    const connectedProviderService = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    await connectedProviderService.createConnectedProvider('testId', {
      provider: UserProvider.ATLASSIAN,
      userAvatar: '',
      userEmail: '',
      userId: 'testId',
      userName: '',
    });

    await connectedProviderService.saveUserConnectedCredential(
      'testId',
      'testId',
      {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken',
      },
    );
  }

  it('should be defined', async () => {
    const module = await context.moduleBuilder
      .overrideProvider(AtlassianCurrentUserHandler)
      .useValue(
        AtlassianCurrentUserHandler.fromJestMock(
          jest.fn().mockImplementation((_, res: any, ctx: any) => {
            return res(
              ctx.status(200),
              ctx.json({
                account_id: 'testKey',
                email: 'testEmail',
                name: 'testName',
                picture: 'testDisplayName',
              }),
            );
          }),
        ),
      )
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
    await setupTest(module);
    const res = await axios.post('https://auth.atlassian.com/oauth/token');
    expect(res.data).toEqual({
      access_token: 'newAccessToken',
      refresh_token: 'newRefreshToken',
    });
    const service = module.get<AtlassianTokenService>(AtlassianTokenService);
    const lastValue = await lastValueFrom(
      service.refreshAccessTokenForUser('testId'),
    );
    expect(lastValue).toStrictEqual({
      access_token: 'newAccessToken',
      refresh_token: 'newRefreshToken',
      user: {
        provider: 'atlassian',
        userAvatar: 'testDisplayName',
        userEmail: 'testEmail',
        userId: 'testKey',
        userName: 'testName',
      },
    });
  }, 60000);
});
