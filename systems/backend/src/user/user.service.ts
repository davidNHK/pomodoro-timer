import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type {
  ConnectedProvider,
  ConnectedProviderInput,
} from './connected-provider.model';
import type { User } from './user.model';

type UserStore = Omit<User, 'connectedProviders'> & { refreshToken?: string };

@Injectable()
export class UserService {
  private users: { [userId: string]: UserStore } = {};

  private connectedProvider: {
    [connectedProviderId: string]: ConnectedProvider;
  } = {};

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
        userId = await this.createUser({
          avatar: connectProvider.userAvatar,
          email: connectProvider.userEmail,
          name: connectProvider.userName,
        });
      }
    }

    const shouldUpdateProvider = existingProviderConnectedTo !== userId;
    if (shouldUpdateProvider) {
      this.connectedProvider[connectProvider.userId] = {
        ...connectProvider,
        connectedAt: new Date(),
        connectedToUserId: userId,
      };
    }

    return this.users[userId];
  }

  async userConnectedProviders(userId: string): Promise<ConnectedProvider[]> {
    return Object.values(this.connectedProvider).filter(
      connectedProvider => connectedProvider.connectedToUserId === userId,
    );
  }

  async createUser(user: Omit<UserStore, 'id' | 'createdAt'>) {
    const userId = randomUUID();
    this.users[userId] = {
      ...user,
      createdAt: new Date(),
      id: userId,
    };
    return userId;
  }

  async providerConnectedTo(providerId: string) {
    return this.connectedProvider?.[providerId]?.connectedToUserId;
  }

  async getConnectedProvider(providerId: string) {
    return this.connectedProvider[providerId];
  }

  async isUserIdExist(userId: string) {
    return !!this.users[userId];
  }
}
