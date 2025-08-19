/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { UsersExceptions } from "../exceptions/users.exceptions";

@Catch()
export class UsersExceptionsFilter implements ExceptionFilter
{
    catch(exception: UsersExceptions, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        if(exception instanceof UsersExceptions)
        {
            if(exception.IsUserExisting())
            {
                response.status(HttpStatus.NOT_FOUND).json({
                    method: request.url,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: exception.getMessage()
                })
                return;
            }
            if(exception.DoesEmailAlreadyExist())
            {
                response.status(HttpStatus.BAD_REQUEST).json({
                    method: request.url,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.getMessage()
                })
                return;
            }
            if(exception.DoesUsernameAlreadyExist())
            {
                response.status(HttpStatus.BAD_REQUEST).json({
                    method: request.url,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.getMessage()
                })
                return;
            } 
            if(exception.IsUserSoftDeleted())
            {
                response.status(HttpStatus.BAD_REQUEST).json({
                    method: request.url,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: exception.getMessage()
                })
                return;
            } 
            if(exception.IsUserAdministrator())
            {
                response.status(HttpStatus.FORBIDDEN).json({
                    method: request.url,
                    statusCode: HttpStatus.FORBIDDEN,
                    message: exception.getMessage()
                })
                return;
            } 
        }
        
        //throw new Error("Method not implemented.");
    }

} 