import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtlassianAuthGuard extends AuthGuard('atlassian') {
  override async getAuthenticateOptions(context: ExecutionContext) {
    const req = this.getRequest(context);
    const { id: userId } = req.user || {};
    if (!userId) {
      return {};
    }
    return {
      state: {
        currentUserId: userId,
      },
    };
  }

  getRequest(context: ExecutionContext) {
    // @ts-expect-error https://github.com/nestjs/passport/blob/505579eb28cbbafd7aec92dd670a1ddd21b3bbce/lib/auth.guard.ts#L66
    return super.getRequest(context);
  }
}
