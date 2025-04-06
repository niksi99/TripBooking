/* eslint-disable prettier/prettier */
import { Role } from "src/auth/enums/role.enum";

/* eslint-disable prettier/prettier */
export class UpdateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
}
