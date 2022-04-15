import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { AuthService } from './auth.service';
import type {
  AuthorizationCodeGrantDto,
  RefreshTokenGrantDto,
} from './auth-token.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  token(@Body() body: AuthorizationCodeGrantDto | RefreshTokenGrantDto) {
    if (body.grant_type === 'authorization_code') {
      return this.authService.exchangeTokenFromCode(body.code);
    } else if (body.grant_type === 'refresh_token') {
      return this.authService.refreshAccessToken(body.refresh_token);
    }
    throw new BadRequestException({
      code: ErrorCode.GrantTypeError,
    });
  }
}
