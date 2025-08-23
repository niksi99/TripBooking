/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { RoomExceptions } from "../exceptions/room.exceptions";

@Catch(RoomExceptions)
export class RoomsExceptionsFilter implements ExceptionFilter {
    catch(exception: RoomExceptions, host: ArgumentsHost) {

        console.log("From rooms exception filter: ", exception.getMessage());

        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        if (exception.DoesRoomExist()) {
            return response.status(HttpStatus.NOT_FOUND).json({
                method: request.url,
                statusCode: HttpStatus.NOT_FOUND,
                message: exception.getMessage()
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            method: request.url,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'ROOM.EXCEPTION.FILTER: Internal server error - ' + exception.getMessage()
        });
    }
    
}