import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../error-hanlding/unauthorized.exception';
import { UserService } from '../user/user.service';
import type { TokenUserPayload } from './token-user-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private userService: UserService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate(payload: TokenUserPayload) {
    if (!(await this.userService.isUserIdExist(payload.userId))) {
      throw new UnauthorizedException({
        code: ErrorCode.UserNotFoundError,
        errors: [{ title: 'User not found' }],
      });
    }
    return { userId: payload.userId };
  }
}
