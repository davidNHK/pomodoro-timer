import { describe, expect, it } from '@jest/globals';
import { setTimeout } from 'timers/promises';

import { withNestModuleBuilderContext } from '../../test-helpers/nest-app-context';
import { UserService } from '../user.service';
import { ConnectedProvider, UserProvider } from './connected-provider.model';
import { ConnectedProviderService } from './connected-provider.service';

const context = withNestModuleBuilderContext({
  providers: [ConnectedProviderService, UserService],
});

describe('ConnectedProviderService', () => {
  function serializeConnectedProvider(provider: ConnectedProvider) {
    return {
      ...JSON.parse(JSON.stringify(provider)),
      connectedAt: provider.connectedAt.getTime(),
    };
  }

  function delay(ms: number) {
    return setTimeout(ms);
  }

  it('should save credential when call function', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    await expect(
      service.userProvider('testId', UserProvider.ATLASSIAN),
    ).resolves.toBeUndefined();
    const provider = await service.createConnectedProvider('testId', {
      provider: UserProvider.ATLASSIAN,
      userAvatar: '',
      userEmail: '',
      userId: 'testId',
      userName: '',
    });
    await service.saveUserConnectedCredential('testId', provider.userId, {
      accessToken: 'test',
      refreshToken: 'test',
    });
    await expect(
      service.userProvider('testId', UserProvider.ATLASSIAN),
    ).resolves.toBeDefined();
    await expect(
      service.getUserConnectedCredential('testId', UserProvider.ATLASSIAN),
    ).resolves.toStrictEqual({
      accessToken: 'test',
      refreshToken: 'test',
    });
  });

  it('should connect given provider to auto created user when both not exist', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userConnected = await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: '123',
        userName: 'test',
      },
    });
    const connectedProviders = await service.userConnectedProviders(
      userConnected.id,
    );
    expect(userConnected).toStrictEqual({
      avatar: 'https://http.cat/200',
      createdAt: expect.anything(),
      email: 'test@gmail.com',
      id: expect.any(String),
      name: 'test',
    });
    expect(connectedProviders).toHaveLength(1);
    expect(connectedProviders[0]).toStrictEqual({
      connectedAt: expect.anything(),
      connectedToUserId: expect.any(String),
      id: expect.any(String),
      provider: 'atlassian',
      userAvatar: 'https://http.cat/200',
      userEmail: 'test@gmail.com',
      userId: '123',
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
        userId: '123',
        userName: 'test',
      },
    });
    const userConnected2 = await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.GOOGLE,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: '456',
        userName: 'test',
      },
      connectUserId: userConnected.id,
    });
    const connectedProviders = await service.userConnectedProviders(
      userConnected.id,
    );
    expect(userConnected2).toStrictEqual({
      avatar: 'https://http.cat/200',
      createdAt: expect.anything(),
      email: 'test@gmail.com',
      id: expect.any(String),
      name: 'test',
    });
    expect(connectedProviders).toHaveLength(2);
    expect(connectedProviders[0].provider).toStrictEqual('atlassian');
    expect(connectedProviders[1].provider).toStrictEqual('google');
  });

  it('should connect given provider to other user when it already connected', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userService = await module.get<UserService>(UserService);

    const userIdA = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: '123',
        userName: 'test',
      },
      connectUserId: userIdA,
    });

    await expect(service.providerConnectedTo('123')).resolves.toStrictEqual(
      userIdA,
    );
    const userIdB = await userService.createUser({
      avatar: 'https://http.cat/200',
      email: 'hard-code@gmail.com',
      name: 'hard-code',
    });
    await service.connectProviderToUser({
      connectProvider: {
        provider: UserProvider.ATLASSIAN,
        userAvatar: 'https://http.cat/200',
        userEmail: 'test@gmail.com',
        userId: '123',
        userName: 'test',
      },
      connectUserId: userIdB,
    });
    await expect(service.providerConnectedTo('123')).resolves.toStrictEqual(
      userIdB,
    );
  });

  it('should do nothing when provider already connected to user', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<ConnectedProviderService>(
      ConnectedProviderService,
    );
    const userService = await module.get<UserService>(UserService);

    const userId = await userService.createUser({
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
      connectUserId: userId,
    });
    const connectedProviderAfterFirstCall = serializeConnectedProvider(
      await service.getConnectedProvider('123'),
    );
    await delay(500);
    await service.connectProviderToUser({
      connectProvider,
      connectUserId: userId,
    });
    const connectedProviderAfterSecondCall = serializeConnectedProvider(
      await service.getConnectedProvider('123'),
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
    const userId = await userService.createUser({
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
      connectUserId: userId,
    });
    const connectedProviderAfterFirstCall = serializeConnectedProvider(
      await service.getConnectedProvider('123'),
    );
    await delay(500);
    await service.connectProviderToUser({
      connectProvider,
    });
    const connectedProviderAfterSecondCall = serializeConnectedProvider(
      await service.getConnectedProvider('123'),
    );
    expect(connectedProviderAfterFirstCall).toStrictEqual(
      connectedProviderAfterSecondCall,
    );
  });
});
