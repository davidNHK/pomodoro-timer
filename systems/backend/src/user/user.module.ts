import { Module } from '@nestjs/common';

import { ConnectedCredentialRepository } from './connected-provider/connected-credential.repository';
import { ConnectedProviderRepository } from './connected-provider/connected-provider.repository';
import { ConnectedProviderService } from './connected-provider/connected-provider.service';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  exports: [UserService, ConnectedProviderService, UserRepository],
  providers: [
    UserService,
    ConnectedProviderService,
    UserRepository,
    ConnectedProviderRepository,
    ConnectedCredentialRepository,
  ],
})
export class UserModule {}
