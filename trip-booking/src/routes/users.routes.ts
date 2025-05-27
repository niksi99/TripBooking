/* eslint-disable prettier/prettier */
export class UsersRoutes {
    static readonly BasicRoute = `/users/`
    static readonly CreateRoute = `${UsersRoutes.BasicRoute}create`.toString();
    static readonly GetAllRoute = `${UsersRoutes.BasicRoute}get-all`.toString();
    static readonly GetByIdRoute = `${UsersRoutes.BasicRoute}:id`;  
    static readonly UpdateRoute = UsersRoutes.BasicRoute + ":id";  
    static readonly HardDeleteRoute = UsersRoutes.BasicRoute + "hard-delete/:id";
    static readonly HardDeleteWithAccommodationRoute = UsersRoutes.BasicRoute + "hard-delete-with-accommodation/:id";
    static readonly SoftDeleteRoute = UsersRoutes.BasicRoute + "soft-delete/:id";
    static readonly SoftUndeleteRoute = UsersRoutes.BasicRoute + "soft-undelete/:id";
}