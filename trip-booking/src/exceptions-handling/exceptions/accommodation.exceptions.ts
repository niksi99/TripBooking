/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { AccommodationExceptionsStatusType } from "../exceptions-status-type/accommodation.exceptions";

export class AccommodationExceptions extends HttpException {
    public readonly statusType: AccommodationExceptionsStatusType;
    
    constructor(
        message: string,
        status: AccommodationExceptionsStatusType,
        httpStatus: HttpStatus
    ) {
        super({message: message}, httpStatus);
        this.statusType = status;
    }

    public getMessage() { return this.message; }
    
    public DoesAccommodationExist(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.AccommodationDoesNotExist;
    }

    public IsLocationAlreadyBusy(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.AccommodationOnThisLocationAlreadyExists;
    }

    public HasAccommodationBeedlreadyBooked(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.UserHasAlreadyBookedAccommodation
    }

    public HasNotAccommodationBeedBooked(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.UserHasNotBookedAccommodation
    }

    public IsAccommodationBlocked_SoftDeleted(): boolean {
        return this.statusType === AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted
    }
}