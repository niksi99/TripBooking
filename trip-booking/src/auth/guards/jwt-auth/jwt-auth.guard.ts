/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
dotenv.config();

@Injectable()
export class JwtAuthGuard extends AuthGuard(process.env.JWT_AUTH_GUARD) {
    handleRequest(err, user, info, context) {
    if (err || !user) {
        throw new AuthExceptions(
            info?.message || 'Unauthorized',
            AuthExceptionStatusType.UserIsNotLoggedIn,
            HttpStatus.UNAUTHORIZED
        );
    }
    console.log("From jwt auth guard error: ", err);
    console.log("From jwt auth guard user: ", user);
    return user;
    }
}
