/* eslint-disable prettier/prettier */
export enum AuthExceptionStatusType {
    UserIsAlreadyLoggedIn,
    UserIsNotLoggedIn,
    UsersRoleDoesNotLetHimUsingThisMethod,
    UsersRoleDoesNotExist,
    TokenDoesNotExist,
    TokenExpired,
    InvalidPassword
}