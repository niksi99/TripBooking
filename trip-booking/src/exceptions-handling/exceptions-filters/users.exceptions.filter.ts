/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { UsersExceptions } from "../exceptions/users.exceptions";

@Catch()
export class UsersExceptionsFilter implements ExceptionFilter
{
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();

        if(exception instanceof UsersExceptions)
        {
            if(exception.IsUserExisting())
            {
                response.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: exception.getMessage()
                })
                return;
            }
            if(exception.DoesEmailAlreadyExist())
            {
                response.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.getMessage()
                })
                return;
            }
            if(exception.DoesUsernameAlreadyExist())
            {
                response.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.getMessage()
                })
                return;
            } 
        }
        
        //throw new Error("Method not implemented.");
    }

} 