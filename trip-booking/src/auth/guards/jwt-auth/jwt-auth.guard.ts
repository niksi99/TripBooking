/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.JWT_AUTH_GUARD, "JEFNUOEQ");
@Injectable()
export class JwtAuthGuard extends AuthGuard(process.env.JWT_AUTH_GUARD) {

}
