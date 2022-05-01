import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { from, map } from 'rxjs';

import { ErrorCode } from '../../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../../error-hanlding/unauthorized.exception';
import { UserService } from '../user.service';
import type {
  ConnectedProvider,
  ConnectedProviderInput,
  UserProvider,
} from './connected-provider.model';

@Injectable()
export class ConnectedProviderService {
  connectedCredential: {
    [userId: string]: {
      [providerUserId: string]: {
        accessToken: string;
        refreshToken: string;
      };
    };
  } = {};

  private connectedProvider: {
    [providerUserId: string]: ConnectedProvider;
  } = {};

  constructor(private userService: UserService) {}

  saveUserConnectedCredential(
    userId: string,
    providerUserId: string,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    this.connectedCredential[userId] = this.connectedCredential[userId] || {};
    this.connectedCredential[userId][providerUserId] = {
      accessToken,
      refreshToken,
    };
  }

  async getUserConnectedCredential(userId: string, provider: UserProvider) {
    const connector = await this.userProvider(userId, provider);
    return connector
      ? this.connectedCredential[userId][connector.userId]
      : null;
  }

  getUserConnectedCredential$(userId: string, provider: UserProvider) {
    return from(this.userProvider(userId, provider)).pipe(
      map(connector => {
        if (!connector)
          throw new UnauthorizedException({
            code: ErrorCode.ConnectedProviderCredentialError,
            errors: [{ title: 'Connector not found' }],
          });
        const credential = this.connectedCredential[userId][connector.userId];
        if (!credential)
          throw new UnauthorizedException({
            code: ErrorCode.ConnectedProviderCredentialError,
            errors: [{ title: 'Credential not found' }],
          });
        return credential;
      }),
    );
  }

  async connectProviderToUser({
    connectProvider,
    connectUserId,
  }: {
    connectProvider: ConnectedProviderInput;
    connectUserId?: string;
  }) {
    let userId = connectUserId;
    const existingProviderConnectedTo = await this.providerConnectedTo(
      connectProvider.userId,
    );
    if (!userId) {
      if (existingProviderConnectedTo) {
        userId = existingProviderConnectedTo;
      } else {
        userId = await this.userService.createUser({
          avatar: connectProvider.userAvatar,
          email: connectProvider.userEmail,
          name: connectProvider.userName,
        });
      }
    }

    const shouldUpdateProvider = existingProviderConnectedTo !== userId;
    if (shouldUpdateProvider) {
      await this.createConnectedProvider(userId, connectProvider);
    }

    return this.userService.getUser(userId);
  }

  async createConnectedProvider(
    userId: string,
    connectedProvider: ConnectedProviderInput,
  ) {
    const record = {
      ...connectedProvider,
      connectedAt: new Date(),
      connectedToUserId: userId,
      id: randomUUID(),
    };
    this.connectedProvider[connectedProvider.userId] = record;
    return record;
  }

  async userConnectedProviders(userId: string): Promise<ConnectedProvider[]> {
    return Object.values(this.connectedProvider).filter(
      connectedProvider => connectedProvider.connectedToUserId === userId,
    );
  }

  async userProvider(
    userId: string,
    provider: UserProvider,
  ): Promise<ConnectedProvider | undefined> {
    return Object.values(this.connectedProvider).find(
      connectedProvider =>
        connectedProvider.connectedToUserId === userId &&
        connectedProvider.provider === provider,
    );
  }

  async providerConnectedTo(providerUserId: string) {
    return this.connectedProvider?.[providerUserId]?.connectedToUserId;
  }

  async getConnectedProvider(providerUserId: string) {
    return this.connectedProvider[providerUserId];
  }
}
