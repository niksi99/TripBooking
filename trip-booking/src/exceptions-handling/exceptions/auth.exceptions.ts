/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthExceptionStatusType } from "../exceptions-status-type/auth.exceptions.status.types";

export class AuthExceptions extends HttpException {
    public readonly statusType: AuthExceptionStatusType;

    constructor(
        message: string,
        status: AuthExceptionStatusType
    ) {
        super({message: message}, HttpStatus.BAD_REQUEST);
        this.statusType = status;
    }

    public getMessage() { return this.message; }

    public IsUserLoggedOut(): boolean {
        return this.statusType === AuthExceptionStatusType.UserIsNotLoggedIn;
    }

    public IsUserLoggedIn(): boolean {
        return this.statusType === AuthExceptionStatusType.UserIsAlreadyLoggedIn;
    }

    public CanUserUseThisMethod(): boolean {
        return this.statusType === AuthExceptionStatusType.UsersRoleDoesNotLetHimUsingThisMethod;
    }

    public DoesTokenExist(): boolean {
        return this.statusType === AuthExceptionStatusType.TokenDoesNotExist;
    }

    public IsTokenAvailable(): boolean {
        return this.statusType === AuthExceptionStatusType.TokenExpired;
    }

    public IsPasswordInvalid(): boolean {
        return this.statusType === AuthExceptionStatusType.InvalidPassword;
    }

    public CanAdministratorBeDeleted(): boolean {
        return this.statusType === AuthExceptionStatusType.AdministratorCanNotBeDeleted;
    }
}