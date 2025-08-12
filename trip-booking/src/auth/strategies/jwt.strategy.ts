/* eslint-disable prettier/prettier */
import { Inject, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";
import { Request } from 'express';

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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    const token: string = request?.cookies?.['access_token'][0];
                    if(!token || token === 'undefined')
                        throw new UnauthorizedException("From jwt strategy: Token is null or undefined.");
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
            throw new UnauthorizedException('User not found or token invalid');
        }
        return user;
    }

}