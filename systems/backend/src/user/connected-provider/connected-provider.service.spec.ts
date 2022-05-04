import { describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { setTimeout } from 'timers/promises';

import { DatabaseModule } from '../../database/database.module';
import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { ConnectedCredentialRepository } from './connected-credential.repository';
import { ConnectedProvider, UserProvider } from './connected-provider.model';
import { ConnectedProviderRepository } from './connected-provider.repository';
import { ConnectedProviderService } from './connected-provider.service';

const context = withNestModuleBuilderContext({
  imports: [DatabaseModule.forFeature()],
  providers: [
    ConnectedCredentialRepository,
    ConnectedProviderRepository,
    ConnectedProviderService,
    UserRepository,
    UserService,
  ],
});

describe('ConnectedProviderService', () => {
  function serializeConnectedProvider(provider: ConnectedProvider | null) {
    return {
      ...JSON.parse(JSON.stringify(provider)),
      connectedAt: provider?.connectedAt?.toString(),
    };
  }

  function delay(ms: number) {
    return setTimeout(ms);
  }

  async function setupTest(module: TestingModule) {
    const userService = module.get<UserService>(UserService);
    const user = await userService.createUser({
      email: 'test@email.com',
      name: 'test@email.com',
    });
    return { user };
  }

  it('should save credential when call function', async () => {
    const module = await context.moduleBuilder.compile();
    const { user } = await setupTest(module);
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    await expect(
      service.userProvider(user.id, UserProvider.ATLASSIAN),
    ).resolves.toBeNull();
    const provider = await service.createConnectedProvider(user.id, {
      provider: UserProvider.ATLASSIAN,
      userAvatar: '',
      userEmail: '',
      userId: 'testId',
      userName: '',
    });
    await service.saveUserConnectedCredential(user.id, provider.id, {
      accessToken: 'test',
      refreshToken: 'test',
    });
    await expect(
      service.userProvider(user.id, UserProvider.ATLASSIAN),
    ).resolves.toBeDefined();
    const { accessToken, refreshToken } =
      (await service.getUserConnectedCredential(
        user.id,
        UserProvider.ATLASSIAN,
      ))!;
    expect({ accessToken, refreshToken }).toStrictEqual({
      accessToken: 'test',
      refreshToken: 'test',
    });
  });

  it('should connect given provider to auto created user when both not exist', async () => {
    const module = await context.moduleBuilder.compile();

    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const {
      avatar,
      email,
      id: userId,
      name,
    } = (await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: randomUUID(),
        userName: 'test',
      },
    }))!;
    expect({ avatar, email, name }).toStrictEqual({
      avatar: 'https://http.cat/200',
      email: 'test@gmail.com',
      name: 'test',
    });

    const connectedProviders = await service.userConnectedProviders(userId);

    expect(connectedProviders).toHaveLength(1);
    expect(connectedProviders[0]).toStrictEqual({
      connectedAt: expect.anything(),
      connectedToUserId: expect.any(String),
      id: expect.any(String),
      provider: 'atlassian',
      userAvatar: 'https://http.cat/200',
      userEmail: 'test@gmail.com',
      userId: expect.any(String),
      userName: 'test',
    });
  });

  it('should connect given provider to specific user when user already exist', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userConnected = await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: randomUUID(),
        userName: 'test',
      },
    });
    const userConnected2 = await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.GOOGLE,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: randomUUID(),
        userName: 'test',
      },
      connectUserId: userConnected!.id,
    });
    const connectedProviders = await service.userConnectedProviders(
      userConnected!.id,
    );
    expect(userConnected2).toStrictEqual({
      avatar: 'https://http.cat/200',
      createdAt: expect.anything(),
      email: 'test@gmail.com',
      id: expect.any(String),
      name: 'test',
    });
    expect(connectedProviders).toHaveLength(2);
    expect(
      [connectedProviders[0].provider, connectedProviders[1].provider].sort(),
    ).toStrictEqual(['atlassian', 'google']);
  });

  it('should connect given provider to other user when it already connected', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userService = await module.get<UserService>(UserService);

    const userA = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    const userAAtlassianId = randomUUID();
    await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: userAAtlassianId,
        userName: 'test',
      },
      connectUserId: userA.id,
    });

    await expect(
      service.providerConnectedTo(UserProvider.ATLASSIAN, userAAtlassianId),
    ).resolves.toStrictEqual(userA.id);
    const userB = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    const userBAtlassianId = randomUUID();
    await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: userBAtlassianId,
        userName: 'test',
      },
      connectUserId: userB.id,
    });
    await expect(
      service.providerConnectedTo(UserProvider.ATLASSIAN, userBAtlassianId),
    ).resolves.toStrictEqual(userB.id);
  });

  it('should do nothing when provider already connected to user', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userService = await module.get<UserService>(UserService);

    const user = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    const userAtlassianId = randomUUID();
    const connectProvider = {
      provider: UserProvider.ATLASSIAN,
      userAvatar: 'https://http.cat/200',
      userEmail: 'test@gmail.com',
      userId: userAtlassianId,
      userName: 'test',
    };
    await service.connectProviderToUser({
      connectProvider,
      connectUserId: user.id,
    });
    const connectedProviderAfterFirstCall = serializeConnectedProvider(
      await service.getConnectedProvider(
        UserProvider.ATLASSIAN,
        userAtlassianId,
      ),
    );
    await delay(500);
    await service.connectProviderToUser({
      connectProvider,
      connectUserId: user.id,
    });
    const connectedProviderAfterSecondCall = serializeConnectedProvider(
      await service.getConnectedProvider(
        UserProvider.ATLASSIAN,
        userAtlassianId,
      ),
    );
    expect(connectedProviderAfterFirstCall).toStrictEqual(
      connectedProviderAfterSecondCall,
    );
  });

  it('should do nothing when provider already connected to user and current user is missing', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userService = await module.get<UserService>(UserService);
    const user = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    const connectProvider = {
      provider: UserProvider.ATLASSIAN,
      userAvatar: 'https://http.cat/200',
      userEmail: 'test@gmail.com',
      userId: '123',
      userName: 'test',
    };
    await service.connectProviderToUser({
      connectProvider,
      connectUserId: user.id,
    });
    const connectedProviderAfterFirstCall = serializeConnectedProvider(
      await service.getConnectedProvider(UserProvider.ATLASSIAN, '123'),
    );
    await delay(500);
    await service.connectProviderToUser({
      connectProvider,
    });
    const connectedProviderAfterSecondCall = serializeConnectedProvider(
      await service.getConnectedProvider(UserProvider.ATLASSIAN, '123'),
    );
    expect(connectedProviderAfterFirstCall).toStrictEqual(
      connectedProviderAfterSecondCall,
    );
  });
});
