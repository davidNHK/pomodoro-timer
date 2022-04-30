import { describe, expect, it, jest } from '@jest/globals';
import { HttpModule } from '@nestjs/axios';
import type { TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';

import { AuthModule } from '../../auth/auth.module';
import { MockHttpModule } from '../../test-helpers/mock-http/mock-http.module';
import {
  AtlassianTokenAccessibleResourcesHandler,
  AtlassianTokenAccessibleResourcesMock,
} from '../../test-helpers/mock-http/mock-http-handlers/atlassian-token-accessible-resources.mock';
import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { UserProvider } from '../../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../../user/connected-provider/connected-provider.service';
import { UserModule } from '../../user/user.module';
import { JiraService } from './jira.service';

const context = withNestModuleBuilderContext({
  imports: [HttpModule, UserModule, AuthModule, MockHttpModule],
  providers: [JiraService, AtlassianTokenAccessibleResourcesMock],
});

describe('JiraService', () => {
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
  it('should able mock api response', async () => {
    const module = await context.moduleBuilder
      .overrideProvider(AtlassianTokenAccessibleResourcesHandler)
      .useValue({
        resolve: jest.fn().mockImplementation((_, res: any, ctx: any) => {
          return res(
            ctx.json({
              hello: 'world',
            }),
          );
        }),
      })
      .compile();
    await setupTest(module);
    const service = module.get<JiraService>(JiraService);

    const body = await lastValueFrom(service.getCloudIds$('testId'));
    expect(body.data).toStrictEqual({ hello: 'world' });
  });
});
