/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";
import { Request } from 'express';
import { AuthExceptions } from "src/exceptions-handling/exceptions/auth.exceptions";
import { AuthExceptionStatusType } from "src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types";

export class JwtStragy extends PassportStrategy(Strategy) {

    constructor(
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly authService: AuthService
    ) {
        if (!jwtConfiguration.secret) {
            throw new Error('JWT secret is undefined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const tokenArray = request?.cookies?.['access_token'];
                    const token: string | undefined = Array.isArray(tokenArray) ? tokenArray[0] : tokenArray;
                    
                    // if(!token || token === 'undefined')
                    //     throw new UnauthorizedException("From jwt strategy: Token is null or undefined.");
                    //return token;
                    if (!token || token === 'undefined') {
                        throw new AuthExceptions(
                            'From jwt strategy: Token does not exist',
                            AuthExceptionStatusType.TokenDoesNotExist,
                            HttpStatus.UNAUTHORIZED
                        );
                    }
                    console.log("FROM jwt.stragy - super: CREATE ACCOM. ", token);
                    return token;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: jwtConfiguration.secret,
            ignoreExpiration: false,
        });

    }

    async validate(payload: AuthJwtPayload) {
        const user = await this.authService.validateJwtUser(payload.sub);
        
        if (!user) {
            throw new AuthExceptions(
                'From jwt strategy: User not found or token invalid',
                AuthExceptionStatusType.UserIsNotLoggedIn,
                HttpStatus.UNAUTHORIZED
            );
        }
        console.log("FROM jwt.stragy - validate: CREATE ACCOM. ", user);
        return user;
    }

}