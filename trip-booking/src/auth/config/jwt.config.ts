/* eslint-disable prettier/prettier */
import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_AUTH_GUARD) {
    throw new Error("JWT_AUTH_GUARD environment variable is not set");
}

export default registerAs(process.env.JWT_AUTH_GUARD, (): JwtModuleOptions => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
            expiresIn: process.env.JWT_EXPIRY_TIME
        }
    })
);