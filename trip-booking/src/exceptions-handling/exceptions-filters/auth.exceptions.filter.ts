/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { AuthExceptions } from "../exceptions/auth.exceptions";

@Catch(AuthExceptions)
export class AuthExceptionsFilter implements ExceptionFilter {
    catch(exception: AuthExceptions, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        console.log("From auth exception filter: ", exception.getMessage());

        if (exception.IsPasswordInvalid()) {
        return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.getMessage()
        });
        }

        if (exception.DoesTokenExist()) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: exception.getMessage()
            });
        }

        if (exception.IsUserLoggedOut()) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: exception.getMessage()
            });
        }

        if (exception.IsUserLoggedIn()) {
            return response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: exception.getMessage()
            });
        }

        if (exception.CanUserUseThisMethod()) {
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: exception.getMessage()
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            method: request.url,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'AUTH.EXCEPTION.FILTER: Internal server error - ' + exception.getMessage()
        });
    }

}