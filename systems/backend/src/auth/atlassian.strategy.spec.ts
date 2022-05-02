import { describe, expect, it, jest } from '@jest/globals';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';

import { AtlassianRefreshTokenHandler } from '../test-helpers/mock-http';
import { MockHttpModule } from '../test-helpers/mock-http/mock-http.module';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { UserProvider } from '../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../user/connected-provider/connected-provider.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
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
    const userService = module.get<UserService>(UserService);
    const user = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test',
    });
    const connectedProvider =
      await connectedProviderService.createConnectedProvider(user.id, {
        provider: UserProvider.ATLASSIAN,
        userAvatar: '',
        userEmail: '',
        userId: 'testId',
        userName: '',
      });

    await connectedProviderService.saveUserConnectedCredential(
      user.id,
      connectedProvider.id,
      {
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken',
      },
    );
    return {
      connectedProvider,
      user,
    };
  }

  it('should set new access token to provider', async () => {
    const module = await context.moduleBuilder
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
    const { user } = await setupTest(module);

    const service = module.get<AtlassianTokenService>(AtlassianTokenService);
    const lastValue = await lastValueFrom(
      service.refreshAccessTokenForUser(user.id),
    );
    expect(lastValue).toStrictEqual({
      access_token: 'newAccessToken',
      refresh_token: 'newRefreshToken',
    });
  });
});
