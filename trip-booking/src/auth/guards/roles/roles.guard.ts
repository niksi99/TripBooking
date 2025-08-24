/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/enums/role.enum';
import * as dotenv from 'dotenv';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
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
    console.log("FROM roles.guards: CREATE ACCOM. ", user);

    if (!requiredRoles.length) {
      console.log("ROLES GUARD: NO ROLES REQUIRED → PASS");
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      console.log("ROLES GUARD: THROW FORBIDDEN", hasRole);
      throw new AuthExceptions(
        `Access denied: Only ${requiredRoles.join(', ')} can perform this action`,
        AuthExceptionStatusType.UsersRoleDoesNotLetHimUsingThisMethod,
        HttpStatus.FORBIDDEN
      );
    }

    console.log("ROLES GUARD PASS");
    return true;
  }
}
