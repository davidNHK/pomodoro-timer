import { describe, expect, it, jest } from '@jest/globals';
import { HttpModule } from '@nestjs/axios';
import type { TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';

import { AuthModule } from '../../auth/auth.module';
import {
  AtlassianAssignedIssuesHandler,
  AtlassianCurrentUserHandler,
  AtlassianRefreshTokenHandler,
  AtlassianTokenAccessibleResourcesHandler,
} from '../../test-helpers/mock-http';
import { MockHttpModule } from '../../test-helpers/mock-http/mock-http.module';
import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { UserProvider } from '../../user/connected-provider/connected-provider.model';
import { ConnectedProviderService } from '../../user/connected-provider/connected-provider.service';
import { UserModule } from '../../user/user.module';
import { JiraService } from './jira.service';

const context = withNestModuleBuilderContext({
  imports: [MockHttpModule, HttpModule, UserModule, AuthModule],
  providers: [JiraService],
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
  describe('#getCloudIds$', () => {
    it('should get cloudIds', async () => {
      const module = await context.moduleBuilder
        .overrideProvider(AtlassianTokenAccessibleResourcesHandler)
        .useValue(
          AtlassianTokenAccessibleResourcesHandler.fromJestMock(
            jest.fn().mockImplementation((_, res: any, ctx: any) => {
              return res(
                ctx.json({
                  hello: 'world',
                }),
              );
            }),
          ),
        )
        .compile();
      await setupTest(module);
      const service = module.get<JiraService>(JiraService);

      const body = await lastValueFrom(service.getCloudIds$('testId'));
      expect(body.data).toStrictEqual({ hello: 'world' });
    });

    it('should refresh token and get cloud Ids', async () => {
      const atlassianTokenAccessibleResourcesMockFunction = jest
        .fn()
        .mockImplementationOnce((_, res: any, ctx: any) => {
          return res(ctx.status(401), ctx.json({}));
        })
        .mockImplementationOnce((_, res: any, ctx: any) => {
          return res(ctx.status(200), ctx.json([{ id: 'testId' }]));
        });
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
        .overrideProvider(AtlassianCurrentUserHandler)
        .useValue(
          AtlassianCurrentUserHandler.fromJestMock(
            jest.fn().mockImplementation((_, res: any, ctx: any) => {
              return res(
                ctx.json({
                  account_id: 'testId',
                  email: 'testEmail',
                  name: 'testName',
                  picture: 'testDisplayName',
                }),
              );
            }),
          ),
        )
        .overrideProvider(AtlassianTokenAccessibleResourcesHandler)
        .useValue(
          AtlassianTokenAccessibleResourcesHandler.fromJestMock(
            atlassianTokenAccessibleResourcesMockFunction,
          ),
        )
        .compile();
      await setupTest(module);
      const service = module.get<JiraService>(JiraService);

      await lastValueFrom(service.getCloudIds$('testId'));
      expect(
        atlassianTokenAccessibleResourcesMockFunction,
      ).toHaveBeenCalledTimes(2);
      const [[firstCallReq], [secondCallReq]] =
        atlassianTokenAccessibleResourcesMockFunction.mock.calls;

      // @ts-expect-error avoid type casting
      expect(firstCallReq.headers.get('authorization')).toBe(
        'Bearer testAccessToken',
      );
      // @ts-expect-error avoid type casting
      expect(secondCallReq.headers.get('authorization')).toBe(
        'Bearer newAccessToken',
      );
    });
  });

  describe('#getAssignedTask', () => {
    it('should get assigned issue', async () => {
      const module = await context.moduleBuilder
        .overrideProvider(AtlassianTokenAccessibleResourcesHandler)
        .useValue(
          AtlassianTokenAccessibleResourcesHandler.fromJestMock(
            jest.fn().mockImplementation((_, res: any, ctx: any) => {
              return res(ctx.json([{ id: 'cloud-id-1234' }]));
            }),
          ),
        )
        .overrideProvider(AtlassianAssignedIssuesHandler)
        .useValue(
          AtlassianAssignedIssuesHandler.fromJestMock(
            jest.fn().mockImplementation((_, res: any, ctx: any) => {
              return res(
                ctx.json({
                  sections: [{ issues: [{ key: 'TEST-1234' }] }],
                }),
              );
            }),
          ),
        )
        .compile();
      await setupTest(module);
      const service = module.get<JiraService>(JiraService);

      const body = await service.getAssignedTask('testId');
      expect(body).toStrictEqual([{ key: 'TEST-1234' }]);
    });

    it('should get assigned issue on multiple cloud id', async () => {
      const module = await context.moduleBuilder
        .overrideProvider(AtlassianTokenAccessibleResourcesHandler)
        .useValue(
          AtlassianTokenAccessibleResourcesHandler.fromJestMock(
            jest.fn().mockImplementation((_, res: any, ctx: any) => {
              return res(
                ctx.json([{ id: 'cloud-id-0001' }, { id: 'cloud-id-0002' }]),
              );
            }),
          ),
        )
        .overrideProvider(AtlassianAssignedIssuesHandler)
        .useValue(
          AtlassianAssignedIssuesHandler.fromJestMock(
            jest.fn().mockImplementation((req: any, res: any, ctx: any) => {
              const { cloudId } = req.params;
              if (cloudId === 'cloud-id-0001') {
                return res(
                  ctx.json({
                    sections: [
                      { issues: [{ key: 'FOO-0001' }, { key: 'FOO-0002' }] },
                    ],
                  }),
                );
              }
              if (cloudId === 'cloud-id-0002') {
                return res(
                  ctx.json({
                    sections: [
                      { issues: [{ key: 'BAR-0001' }, { key: 'BAR-0002' }] },
                    ],
                  }),
                );
              }
              return res(ctx.json({}));
            }),
          ),
        )
        .compile();
      await setupTest(module);
      const service = module.get<JiraService>(JiraService);

      const body = await service.getAssignedTask('testId');
      expect(body).toStrictEqual([
        { key: 'FOO-0001' },
        { key: 'FOO-0002' },
        { key: 'BAR-0001' },
        { key: 'BAR-0002' },
      ]);
    });
  });
});
