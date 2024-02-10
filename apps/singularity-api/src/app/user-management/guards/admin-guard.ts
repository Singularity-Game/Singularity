import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../types/request-with-user';

export const AdminGuard = (): Type<CanActivate> => {
  class AdminGuardMixin extends AuthGuard('jwt') {
    public async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.isAdmin;
    }
  }

  return mixin(AdminGuardMixin);
}
