import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const isGraphql = context.getType().toString() === 'graphql';
    if (!isGraphql) {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
