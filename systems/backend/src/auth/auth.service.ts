import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../error-hanlding/unauthorized.exception';
import { UserService } from '../user/user.service';
import type { TokenUserPayload } from './token-user-payload';

@Injectable()
export class AuthService {
  private tokenCodes: {
    [code: string]: {
      expires: number;
      userId: string;
    };
  } = {};

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  randomId() {
    return randomUUID().replace(/-/g, '');
  }

  async signTokenExchangeCode(userId: string) {
    const code = this.randomId();
    const expires = Date.now() + 1000 * 60 * 5; // 5 minute
    this.tokenCodes[code] = { expires, userId };
    return code;
  }

  async exchangeTokenFromCode(code: string, signTokenOptions?: JwtSignOptions) {
    const { expires, userId } = this.tokenCodes[code] ?? {};
    if (!userId || Date.now() > expires) {
      throw new UnauthorizedException({
        code: ErrorCode.ExchangeCodeError,
        errors: [{ title: 'Exchange token from code error' }],
        meta: { code, expires, userId },
      });
    }
    delete this.tokenCodes[code];
    const payload: TokenUserPayload = { userId };
    const refreshToken = this.jwtService.sign(payload);
    await this.userService.setUserRefreshToken(userId, refreshToken);
    return {
      accessToken: this.jwtService.sign(payload, signTokenOptions),
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    let userId;
    try {
      const givenPayload = this.jwtService.verify(refreshToken, {
        ignoreExpiration: true,
      });
      userId = givenPayload.userId;
    } catch (e) {
      throw new UnauthorizedException({
        code: ErrorCode.RefreshTokenError,
        errors: [{ title: 'Refresh access token error' }],
        meta: { refreshToken },
      });
    }

    const currentRefreshToken = await this.userService.getUserRefreshToken(
      userId,
    );

    if (!currentRefreshToken || currentRefreshToken !== refreshToken) {
      throw new UnauthorizedException({
        code: ErrorCode.RefreshTokenError,
        errors: [{ title: 'Refresh access token error' }],
        meta: {
          equalToCurrentToken: currentRefreshToken === refreshToken,
          refreshToken,
        },
      });
    }

    const payload: TokenUserPayload = { userId };
    const newRefreshToken = this.jwtService.sign(payload);
    await this.userService.setUserRefreshToken(userId, newRefreshToken);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: newRefreshToken,
    };
  }
}
