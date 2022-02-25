import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const id = user.userId;
    const userData = await this.userService.findUserBy({ id });

    console.log(user);
    console.log(userData);
    return requiredRoles.some((role) => userData.role?.includes(role));
  }
}
