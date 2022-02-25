import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Role } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        console.log({ user });
        const id = user.userId;
        const userData = await this.userService.findUserBy({ id });
        return requiredRoles.some((role) => userData.role?.includes(role));
    }
}

// @Injectable()
// export class RolesGuard extends AuthGuard('jwt') {
//     constructor(
//         private readonly userService: UserService,
//         private reflector: Reflector,
//     ) {
//         super();
//     }
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         // call AuthGuard in order to ensure user is injected in request
//         const baseGuardResult = await super.canActivate(context);
//         if (!baseGuardResult) {
//             // unsuccessful authenticƒation return false
//             return false;
//         }

//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
//             ROLES_KEY,
//             [context.getHandler(), context.getClass()],
//         );
//         if (!requiredRoles) {
//             return true;
//         }

//         // successfull authentication, user is injected
//         // const { user } = context.switchToHttp().getRequest();
//         const request = context.switchToHttp().getRequest();
//         console.log(request);
//         // console.log('user', user);
//         // const userId = user.userId;
//         // const userRole = user.userRole;
//         // console.log('role', userRole);
//         // // console.log(id);

//         // const userData = await this.userService.findUserBy({ id: userId });

//         // // console.log(userData);

//         // return requiredRoles.some((role) => userData.role?.includes(role));
//     }
// }
