/* eslint-disable prettier/prettier */
export enum AuthExceptionStatusType {
    UserIsAlreadyLoggedIn,
    UserIsNotLoggedIn,
    UsersRoleDoesNotLetHimUsingThisMethod,
    TokenDoesNotExist,
    TokenExpired,
    InvalidPassword,
    AdministratorCanNotBeDeleted
}