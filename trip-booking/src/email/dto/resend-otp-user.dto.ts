/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from 'class-validator';

export class ResendOTPUser {
  @IsString()
  @IsEmail()
  email: string;
}