/* eslint-disable prettier/prettier */
export enum AccommodationExceptionsStatusType {
    AccommodationDoesNotExist,
    AccommodationOnThisLocationAlreadyExists,
    UserHasAlreadyBookedAccommodation,
    UserHasNotBookedAccommodation,
    AccommodationIsBlocked_SoftDeleted,
    AccommodationIsNotBlocked_SoftDeleted
}