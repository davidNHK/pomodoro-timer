import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../error-hanlding/unauthorized.exception';
import { UserService } from '../user/user.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenExchangeCodeRepository } from './token-exchange-code.repository';
import type { TokenUserPayload } from './token-user-payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private tokenExchangeCodeRepository: TokenExchangeCodeRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  randomId() {
    return randomUUID().replace(/-/g, '');
  }

  async signTokenExchangeCode(userId: string) {
    const code = this.randomId();
    const expires = Date.now() + 1000 * 60 * 5; // 5 minute
    await this.tokenExchangeCodeRepository.create(code, { expires, userId });
    return code;
  }

  async exchangeTokenFromCode(code: string, signTokenOptions?: JwtSignOptions) {
    const { expires, userId } =
      (await this.tokenExchangeCodeRepository.fineOne(code)) || {};
    if (
      !userId ||
      !(await this.userService.isUserIdExist(userId)) ||
      Date.now() > expires
    ) {
      throw new UnauthorizedException({
        code: ErrorCode.ExchangeCodeError,
        errors: [{ title: 'Exchange token from code error' }],
        meta: { code, expires, userId },
      });
    }
    await this.tokenExchangeCodeRepository.remove(code);
    const payload: TokenUserPayload = { userId };
    const refreshToken = this.jwtService.sign(payload);
    await this.refreshTokenRepository.create(userId, { refreshToken });
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
    const currentRefreshToken = await this.refreshTokenRepository.findOne(
      userId,
    );

    if (
      !currentRefreshToken ||
      currentRefreshToken.refreshToken !== refreshToken
    ) {
      throw new UnauthorizedException({
        code: ErrorCode.RefreshTokenError,
        errors: [{ title: 'Refresh access token error' }],
        meta: {
          equalToCurrentToken:
            currentRefreshToken?.refreshToken === refreshToken,
          refreshToken,
        },
      });
    }

    const payload: TokenUserPayload = { userId };
    const newRefreshToken = this.jwtService.sign(payload);
    await this.refreshTokenRepository.create(userId, {
      refreshToken: newRefreshToken,
    });
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: newRefreshToken,
    };
  }
}
