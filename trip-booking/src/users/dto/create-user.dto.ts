/* eslint-disable prettier/prettier */
import { Role } from "src/auth/enums/role.enum";

/* eslint-disable prettier/prettier */
export class CreateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: Role;
}
