import { Module } from '@nestjs/common';

import { ConnectedProviderService } from './connected-provider/connected-provider.service';
import { UserService } from './user.service';

@Module({
  exports: [UserService, ConnectedProviderService],
  providers: [UserService, ConnectedProviderService],
})
export class UserModule {}
