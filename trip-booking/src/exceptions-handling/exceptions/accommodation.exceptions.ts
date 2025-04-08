/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { AccommodationExceptionsStatusType } from "../exceptions-status-type/accommodation.exceptions";

export class AccommodationExceptions extends HttpException {
    public readonly statusType: AccommodationExceptionsStatusType;
    
    constructor(
        message: string,
        status: AccommodationExceptionsStatusType
    ) {
        super({message: message}, HttpStatus.BAD_REQUEST);
        this.statusType = status;
    }

    public getMessage() { return this.message; }
    
    public DoesAccommodationExist(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.AccommodationDoesNotExist;
    }

    public IsLocationAlreadyBusy(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.AccommodationOnThisLocationAlreadyExists;
    }
}