import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { UserService } from '../user/user.service';
import { AtlassianAuthGuard } from './atlassian-auth.guard';
import { AuthService } from './auth.service';

@Controller('/auth/atlassian')
export class AtlassianController {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
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
    const userConnectedTo = await this.userService.connectProviderToUser({
      connectProvider: user,
      connectUserId: authInfo?.state?.currentUserId,
    });
    const code = await this.authService.signTokenExchangeCode(
      userConnectedTo.id,
    );
    const redirectOrigin = this.configService.get('frontend.origin');
    return {
      url: `${redirectOrigin}/auth/callback?code=${code}`,
    };
  }
}
