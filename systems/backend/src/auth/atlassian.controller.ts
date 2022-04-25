import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { ConnectedProviderService } from '../user/connected-provider/connected-provider.service';
import { AtlassianAuthGuard } from './atlassian-auth.guard';
import { AuthService } from './auth.service';

@Controller('/auth/atlassian')
export class AtlassianController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private connectedProviderService: ConnectedProviderService,
  ) {}

  @UseGuards(AtlassianAuthGuard)
  @Get('login')
  login() {
    return null;
  }

  @UseGuards(AtlassianAuthGuard)
  @Get('callback')
  @Redirect()
  async callback(@Req() req: Request) {
    const user = req.user as any;
    const authInfo = req.authInfo as any;
    const userConnectedTo =
      await this.connectedProviderService.connectProviderToUser({
        connectProvider: user,
        connectUserId: authInfo?.state?.currentUserId,
      });
    await this.connectedProviderService.saveUserConnectedCredential(
      userConnectedTo.id,
      user.userId,
      authInfo,
    );
    const code = await this.authService.signTokenExchangeCode(
      userConnectedTo.id,
    );
    const redirectOrigin = this.configService.get('frontend.origin');
    return {
      url: `${redirectOrigin}/auth/callback?code=${code}`,
    };
  }
}
