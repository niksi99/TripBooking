/* eslint-disable prettier/prettier */
import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtPayload } from "../types/auth-jwtPayload";
import { AuthService } from "../auth.service";

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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret,
            ignoreExpiration: false,
        });

    }

    validate(payload: AuthJwtPayload): unknown {
        return this.authService.validateJwtUser(payload.sub);
    }

}