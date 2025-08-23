/* eslint-disable prettier/prettier */

import { LoginDto } from "src/auth/dto/login.dto";
import { UsersExceptionStatusType } from "src/exceptions-handling/exceptions-status-type/user.exceptions.status.type";
import { UsersExceptions } from "src/exceptions-handling/exceptions/users.exceptions";
import { UserRepository } from "src/repositories/UserRepository";
import * as bcrypt from 'bcrypt';
import { AuthExceptions } from "src/exceptions-handling/exceptions/auth.exceptions";
import { AuthExceptionStatusType } from "src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types";
import { AuthJwtPayload } from "src/auth/types/auth-jwtPayload";
import { JwtService } from "@nestjs/jwt";
import { HttpStatus, Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class AuthHelper {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
        private readonly i18n_translations: I18nService
    ) {}

    public async generateTokens(loginDto: LoginDto, lang: string) {
        //TODO REFRESH TOKEN
        const user = await this.userRepository.getUserByUsername(loginDto?.username);
        if(!user)
            throw new UsersExceptions(
                await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }), 
                UsersExceptionStatusType.UserDoesNotExist
            );

        if(user.deletedAt !== null)
            throw new UsersExceptions(
                await this.i18n_translations.t(`exceptions.user.USER_IS_ALREADY_SOFT_DELETED`, { lang: lang }), 
                UsersExceptionStatusType.UserAlreadySoftDeleted
            );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordMatch)
            throw new AuthExceptions(
                await this.i18n_translations.t(`exceptions.auth.TOKEN_INVALID_PASSWORD`, { lang: lang }), 
                AuthExceptionStatusType.InvalidPassword, 
                HttpStatus.FORBIDDEN
            );

        const payload: AuthJwtPayload = {
            sub: loginDto.username,
            role: user.role
        };

        const accessToken = await Promise.all([
            this.jwtService.signAsync(payload)
        ])
        
        return {
            accessToken,
        }
    }
}