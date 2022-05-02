import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { from, map, mergeMap } from 'rxjs';

import { ErrorCode } from '../../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../../error-hanlding/unauthorized.exception';
import { UserService } from '../user.service';
import { ConnectedCredentialRepository } from './connected-credential.repository';
import type {
  ConnectedProvider,
  ConnectedProviderInput,
  UserProvider,
} from './connected-provider.model';
import { ConnectedProviderRepository } from './connected-provider.repository';

@Injectable()
export class ConnectedProviderService {
  private logger = new Logger(ConnectedProviderService.name);

  constructor(
    private userService: UserService,
    private connectedProviderRepository: ConnectedProviderRepository,
    private connectedCredentialRepository: ConnectedCredentialRepository,
  ) {}

  async saveUserConnectedCredential(
    userId: string,
    connectedProviderId: string,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    return this.connectedCredentialRepository.create({
      accessToken,
      connectedProviderId: connectedProviderId,
      id: randomUUID(),
      refreshToken,
      userId,
    });
  }

  async updateUserConnectedCredential(
    id: string,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    return this.connectedCredentialRepository.update(id, {
      accessToken,
      refreshToken,
    });
  }

  async getUserConnectedCredential(userId: string, provider: UserProvider) {
    const connector = await this.userProvider(userId, provider);
    if (!connector) {
      return null;
    }
    return this.connectedCredentialRepository.findOne({
      connectedProviderId: connector.id,
      userId: userId,
    });
  }

  getUserConnectedCredential$(userId: string, provider: UserProvider) {
    return from(this.userProvider(userId, provider)).pipe(
      mergeMap(connector => {
        if (!connector)
          throw new UnauthorizedException({
            code: ErrorCode.ConnectedProviderCredentialError,
            errors: [{ title: 'Connector not found' }],
          });
        return from(
          this.connectedCredentialRepository.findOne({
            connectedProviderId: connector.id,
            userId: userId,
          }),
        );
      }),
      map(credential => {
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
      connectProvider.provider,
      connectProvider.userId,
    );
    if (!userId) {
      if (existingProviderConnectedTo) {
        userId = existingProviderConnectedTo;
      } else {
        const user = await this.userService.createUser({
          avatar: connectProvider.userAvatar,
          email: connectProvider.userEmail,
          name: connectProvider.userName,
        });
        userId = user.id;
      }
    }

    const shouldUpdateProvider = existingProviderConnectedTo !== userId;
    if (shouldUpdateProvider) {
      await this.createConnectedProvider(userId, connectProvider);
    }

    return (await this.userService.getUser(userId))!;
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
    await this.connectedProviderRepository.create(record);
    return record;
  }

  async userConnectedProviders(userId: string): Promise<ConnectedProvider[]> {
    return this.connectedProviderRepository.findAll({
      connectedToUserId: userId,
    });
  }

  async userProvider(
    userId: string,
    provider: UserProvider,
  ): Promise<ConnectedProvider | null> {
    return this.connectedProviderRepository.findOne({
      connectedToUserId: userId,
      provider,
    });
  }

  async providerConnectedTo(provider: UserProvider, providerUserId: string) {
    return (
      await this.connectedProviderRepository.findOne({
        provider: provider,
        userId: providerUserId,
      })
    )?.connectedToUserId;
  }

  async getConnectedProvider(provider: UserProvider, providerUserId: string) {
    return this.connectedProviderRepository.findOne({
      provider: provider,
      userId: providerUserId,
    });
  }
}
