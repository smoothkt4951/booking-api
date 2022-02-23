import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ROLES_KEY } from './roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector,
//         private readonly userService: UserService,
//     ) {}

//     async canActivate(context: ExecutionContext) {
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
//             ROLES_KEY,
//             [context.getHandler(), context.getClass()],
//         );
//         if (!requiredRoles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         console.log(request);
//         const id = request.userId;
//         console.log(id);
//         const user = await this.userService.findUserBy({ id });

//         console.log(user);
//         return requiredRoles.some((role) => user.role?.includes(role));
//     }
// }
@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
    constructor(
        private readonly userService: UserService,
        private reflector: Reflector,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // call AuthGuard in order to ensure user is injected in request
        const baseGuardResult = await super.canActivate(context);
        if (!baseGuardResult) {
            // unsuccessful authenticƒation return false
            return false;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }

        // successfull authentication, user is injected
        const { user } = context.switchToHttp().getRequest();
        const id = user.userId;
        console.log(id);

        const userData = await this.userService.findUserBy({ id });

        console.log(userData);

        return requiredRoles.some((role) => userData.role?.includes(role));
    }
}
