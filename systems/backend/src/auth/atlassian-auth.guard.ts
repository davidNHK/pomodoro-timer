import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtlassianAuthGuard extends AuthGuard('atlassian') {
  override async getAuthenticateOptions(context: ExecutionContext) {
    const req = this.getRequest(context);
    const { currentUser } = req.query;
    if (!currentUser) {
      return {};
    }
    return {
      state: {
        currentUserId: currentUser,
      },
    };
  }

  getRequest(context: ExecutionContext) {
    // @ts-expect-error https://github.com/nestjs/passport/blob/505579eb28cbbafd7aec92dd670a1ddd21b3bbce/lib/auth.guard.ts#L66
    return super.getRequest(context);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    if (result === true) {
      const req = this.getRequest(context);
      req.authInfo = req.authInfo_;
    }
    return result as boolean;
  }

  // @ts-expect-error no typing here
  override async handleRequest(err, user, info, context, status) {
    if (err || !user) {
      return super.handleRequest(err, user, info, context, status);
    }
    const req = this.getRequest(context);
    // Workaround for authInfo will override by nestjs-passport
    req.authInfo_ = info;
    return user;
  }
}
