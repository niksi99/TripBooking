/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
import { Role } from "src/auth/enums/role.enum";
import { IsAllowedRole } from "src/validators/IsRoleAllowrdValidator";

/* eslint-disable prettier/prettier */
export class CreateUserDto {
    @Length(2, 30, { message: 'First name must be between 2 and 30 characters.' })
    @IsNotEmpty({ message: 'First name is required.' })
    firstName: string;

    @Length(2, 40, { message: 'Last must be between 2 and 40 characters.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    lastName: string;

    @Length(5, 40, { message: 'Username must be between 5 and 40 characters.' })
    @IsNotEmpty({ message: 'Username is required.' })
    username: string;

    @IsEmail({}, { message: 'Email must be a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
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
