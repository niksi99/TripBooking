/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
import { Role } from "src/auth/enums/role.enum";
import { IsAllowedRole } from "src/validators/IsRoleAllowrdValidator";

/* eslint-disable prettier/prettier */
export class CreateUserDto {
    @Length(2, 30, { message: 'firstName.length' })
    @IsNotEmpty({ message: 'firstName.required' })
    firstName: string;

    @Length(2, 40, { message: 'lastName.length' })
    @IsNotEmpty({ message: 'lastName.required' })
    lastName: string;

    @Length(5, 40, { message: 'username.length' })
    @IsNotEmpty({ message: 'username.required' })
    username: string;

    @IsEmail({}, { message: 'email.length' })
    @IsNotEmpty({ message: 'email.required.' })
    email: string;

    @IsNotEmpty({ message: 'password.required.' })
    @MinLength(8, { message: 'password.minLen' })
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    //     message: 'Password must include uppercase, lowercase, number, and special character.',
    // })
    password: string;

    @IsNotEmpty({ message: 'Role is required.' })
    @IsAllowedRole({
        groups: [
            Role.ACCOMMODATION_OWNER,
            Role.ADMINISTRATOR, 
            Role.GUIDE, 
            Role.PASSENGER
        ] as string[], 
        message: `Unidentified Role. Please try again.`, 
    })
    role: Role;
}
