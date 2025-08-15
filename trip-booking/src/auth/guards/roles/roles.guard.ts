/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(process.env.ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const user = context.switchToHttp().getRequest().user;
    console.log("user from ROles gueard", user);
    const hasRequiredRole = requiredRoles.some(role => user.role === role);
    console.log("hasRequiredROle", hasRequiredRole);

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException({
        statusCode: 403,
        message: `Access denied: Only ${requiredRoles.join(', ')} can perform this action`,
        error: 'Forbidden',
      });
    }

    return hasRequiredRole;
  }
}
