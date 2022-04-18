import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { ErrorCode } from '../error-hanlding/error-code.constant';
import { UnauthorizedException } from '../error-hanlding/unauthorized.exception';
import type { TokenUserPayload } from './token-user-payload';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const isGraphql = context.getType().toString() === 'graphql';

    if (!isGraphql) {
      // @ts-expect-error no type here
      return super.getRequest(context);
    }
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }

  override handleRequest<T = TokenUserPayload>(err?: Error, user?: T) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException({
        code: ErrorCode.AccessTokenError,
        errors: ['Access Token error'],
      });
    }
    return user;
  }
}
