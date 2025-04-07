/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

console.log("ROles guiard ", process.env.ROLES_KEY);
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
    const hasRequiredRole = requiredRoles.some(role => user.role === role);
    
    return hasRequiredRole;
  }
}
