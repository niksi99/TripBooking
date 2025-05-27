/* eslint-disable prettier/prettier */
export class AppRoutes {
    static readonly BasicUsersRoute = `/users/`

    static readonly CreateRoute = `create`;
    static readonly GetAllRoute = `get-all`;
    static readonly GetByIdRoute = `:id`;  
    static readonly UpdateRoute = `:id`;  
    static readonly HardDeleteRoute = "hard-delete/:id";
    static readonly HardDeleteWithAccommodationRoute = "hard-delete-with-accommodation/:id";
    static readonly SoftDeleteRoute = "soft-delete/:id";
    static readonly SoftUndeleteRoute = "soft-undelete/:id";
}