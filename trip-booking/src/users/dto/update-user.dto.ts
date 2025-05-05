/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, Length } from "class-validator";

export class UpdateUserDto {
    @Length(2, 30, { message: 'First name must be between 2 and 30 characters.' })
    @IsNotEmpty({ message: 'First name is required.' })
    firstName: string;

    @Length(2, 40, { message: 'Last must be between 2 and 40 characters.' })
    @IsNotEmpty({ message: 'Last name is required.' })
    lastName: string;
}
