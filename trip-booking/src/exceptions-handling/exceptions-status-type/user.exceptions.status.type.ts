/* eslint-disable prettier/prettier */
export enum UsersExceptionStatusType {
    UserDoesNotExist,
    UsersDoNotExist,
    UserAlreadyExists,
    UsernameAlreadyExists,
    EmailAlreadyExists,
    UserAlreadySoftDeleted,
    UserIsNotSoftUndeleted,
    UsersRoleDoesNotExist,
    UsersRoleCanNotBeEmpty,
    UserIsNotAccommodationOwner,
    UserIsNotPassenger,
    UserIsAdministrator,
    UserIsNotAccommodationOwnerOfSelectedAccommodation_RoomCreation
}