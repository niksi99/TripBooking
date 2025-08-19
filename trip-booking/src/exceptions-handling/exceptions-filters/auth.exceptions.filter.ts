/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { AuthExceptions } from "../exceptions/auth.exceptions";

@Catch()
export class AuthExceptionsFilter implements ExceptionFilter {
    catch(exception: AuthExceptions, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();

        if(exception.CanAdministratorBeDeleted())
        {
            response.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: exception.getMessage()
            })
            return;
        }

        return response.status(500).json({ message: 'Internal server error' });
    }

}