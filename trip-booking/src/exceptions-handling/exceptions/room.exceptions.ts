/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { RoomExceptionsStatusType } from "../exceptions-status-type/room.exceptions.status.type";

export class RoomExceptions extends HttpException {
    public readonly statusType: RoomExceptionsStatusType;
    
    constructor(
        message: string,
        status: RoomExceptionsStatusType,
        httpStatus: HttpStatus
    ) {
        super({message: message}, httpStatus);
        this.statusType = status;
    }

    public getMessage() { return this.message; }

    public DoesRoomExist(): boolean {
        return this.statusType === RoomExceptionsStatusType.RoomDoesNotExist
    }

    public DoesRoomAlreadyExist(): boolean {
        return this.statusType === RoomExceptionsStatusType.RoomAlreadyExists
    }

    public IsRoomBlocked(): boolean {
        return this.statusType === RoomExceptionsStatusType.RoomIsNotBlocked_SoftDeleted
    }

    public CanRoomBeBlocked_SoftDeleted(): boolean {
        return this.statusType === RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted
    }

    public IsRoomBlocked_SoftDeleted() : boolean {
        return this.statusType === RoomExceptionsStatusType.RoomIsBlocked_SoftDeleted
    }
}