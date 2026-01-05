/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/user.exceptions.status.type';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { UserRepository } from 'src/repositories/UserRepository';
import { CurrentUser } from './types/current-user';
import { LoginDto } from './dto/login.dto';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
import { AuthHelper } from 'src/helpers/auth.helper';
import { I18nService } from 'nestjs-i18n';
import { OtpService } from 'src/otp/otp.service';
import { RequestLocalStorageService } from 'src/local-storage-service/request.local.storage.service';

@Injectable()
export class AuthService {

    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private otpService: OtpService,
        private myAuthHelper: AuthHelper,
        private readonly i18n_translations: I18nService,
        private readonly requestLocalStorageService: RequestLocalStorageService
    ) {}

    async login(loginDto: LoginDto, lang: string) {
        const { accessToken, } = await this.myAuthHelper.generateTokens(loginDto, lang);
        if(!accessToken)
            throw new AuthExceptions(
                await this.i18n_translations.t(`exceptions.auth.TOKEN_IS_NOT_GENERATED`, { lang: lang }),
                AuthExceptionStatusType.TokenDoesNotExist, 
                HttpStatus.NOT_FOUND
            );
        
        console.log(accessToken[0], "login");

        return {
            accessToken: accessToken[0],
            message: "Log in succesfully",
            statusCode: HttpStatus.OK
        }
    }

    async validateJwtUser(username: string) {
        const user = await this.userRepository.getUserByUsername(username);
        if(!user)
            throw new UsersExceptions("User not found.", UsersExceptionStatusType.UserDoesNotExist);
    
        const currentUser: CurrentUser = {
            username: user.username,
            role: user.role
        }
        console.log("currentUser", currentUser);
        return currentUser;
    }

    async verifyOTPToken(email: string, otpToken: string) {
        const lang = this.requestLocalStorageService.get<string>('locale_lang');
        await this.otpService.validateOTPToken(email, otpToken)

        const userToVerify = await this.userRepository.getUserByEmail(email);
        if(!userToVerify)
            throw new UsersExceptions(
                await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }),
                UsersExceptionStatusType.UserDoesNotExist
            );
        
        if(userToVerify.accountStatus === 'verified')
            throw new UsersExceptions(
                await this.i18n_translations.t(`exceptions.user.USER_Is_ALREADY_VERIFIED`, { lang: lang }),
                UsersExceptionStatusType.UserIsAlreadyVerified
            );

        userToVerify.accountStatus = 'verified'
        await this.userRepository.save(userToVerify);

        return userToVerify;
    }
}
