/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtAuthGuard extends AuthGuard(process.env.JWT_AUTH_GUARD) {

}
