/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from "class-validator";

export class VerifyUserDTO {
    @IsEmail()
    email: string

    @IsString()
    otpToken: string
}