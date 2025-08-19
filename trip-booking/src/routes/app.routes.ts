/* eslint-disable prettier/prettier */
export class AppRoutes {
    static readonly BasicUsersRoute = `/users/`
    static readonly BasicRoomsRoute = `/rooms/`
    static readonly BasicAcommodationRoute = `/accommodations/`
    static readonly BasicAuthRoute = `/auth/`

    static readonly Login = `login`;
    static readonly Logout = `logout`;

    static readonly CreateRoute = `create`;
    static readonly GetAllRoute = `get-all`;
    static readonly GetByIdRoute = `:id`;  
    static readonly UpdateRoute = `:id`;  
    static readonly HardDeleteRoute = "hard-delete/:id";
    static readonly HardDeleteWithAccommodationRoute = "hard-delete-with-accommodation/";
    static readonly SoftDeleteRoute = "soft-delete/:id";
    static readonly SoftUndeleteRoute = "soft-undelete/:id";

    static readonly GetAllRoomsOfSingleAccommodation = "all-rooms-of-single-accommodation/:accommodationId";

    static readonly BookRoomsOfSingleAccommodation = "book-accommodation/:accommId";
    static readonly UnbookAccommodation = "unbook-accommodation/:accommId";
}