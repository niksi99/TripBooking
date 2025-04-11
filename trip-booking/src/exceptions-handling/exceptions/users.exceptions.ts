/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { UsersExceptionStatusType } from "../exceptions-status-type/user.exceptions.status.type";

export class UsersExceptions extends HttpException {
    public readonly statusType: UsersExceptionStatusType;

    constructor(
        message: string,
        status: UsersExceptionStatusType
    ) {
        super({message: message}, HttpStatus.BAD_REQUEST);
        this.statusType = status;
    }

    public getMessage() { return this.message; }

    public IsUserExisting(): boolean {
        return this.statusType === UsersExceptionStatusType.UserDoesNotExist;
    }

    public AreUsersMissing(): boolean {
        return this.statusType === UsersExceptionStatusType.UsersDoNotExist;
    }

    public DoesUserAlreadyExist(): boolean {
        return this.statusType === UsersExceptionStatusType.UserAlreadyExists;
    }

    public DoesUsernameAlreadyExist(): boolean {
        return this.statusType === UsersExceptionStatusType.UsernameAlreadyExists;
    }

    public DoesEmailAlreadyExist(): boolean {
        return this.statusType === UsersExceptionStatusType.EmailAlreadyExists;
    }

    public IsUserSoftDeleted(): boolean {
        return this.statusType === UsersExceptionStatusType.UserAlreadySoftDeleted;
    }

    public IsNotUserSoftDeleted(): boolean {
        return this.statusType === UsersExceptionStatusType.UserIsNotSoftUndeleted;
    }

    public IsUserAccommodationOwner(): boolean {
        return this.statusType === UsersExceptionStatusType.UserIsNotAccommodationOwner;
    }

    public IsUserPassenger(): boolean {
        return this.statusType === UsersExceptionStatusType.UserIsNotPassenger;
    }
}