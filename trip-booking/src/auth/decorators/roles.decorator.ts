/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";
import * as dotenv from 'dotenv';
dotenv.config();

export const ROLES_KEY = process.env.ROLES_KEY
export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata(ROLES_KEY, roles)