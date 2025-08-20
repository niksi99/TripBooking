/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { AccommodationExceptions } from "../exceptions/accommodation.exceptions";

@Catch()
export class AccommodationsExceptionsFilter implements ExceptionFilter {
    catch(exception: AccommodationExceptions, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();

        console.log("From accomm exceptons filter");

        if(exception.DoesAccommodationExist())
        {
            response.status(HttpStatus.NOT_FOUND).json({
                method: request.url,
                statusCode: HttpStatus.NOT_FOUND,
                message: exception.getMessage()
            })
            return;
        }
        if(exception.HasAccommodationBeedlreadyBooked())
        {
            response.status(HttpStatus.BAD_REQUEST).json({
                method: request.url,
                statusCode: HttpStatus.BAD_REQUEST,
                message: exception.getMessage()
            })
            return;
        }
        if(exception.IsLocationAlreadyBusy())
        {
            response.status(HttpStatus.CONFLICT).json({
                method: request.url,
                statusCode: HttpStatus.CONFLICT,
                message: exception.getMessage()
            })
            return;
        }
        if(exception.HasNotAccommodationBeedBooked())
        {
            response.status(HttpStatus.BAD_REQUEST).json({
                method: request.url,
                statusCode: HttpStatus.BAD_REQUEST,
                message: exception.getMessage()
            })
            return;
        }

       return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            method: request.url,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'ACCOMM.EXCEPTION.FILTER: Internal server error'
        });
    }

}