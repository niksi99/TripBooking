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

@Injectable()
export class AuthService {

    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private myAuthHelper: AuthHelper
    ) {}

    async login(loginDto: LoginDto) {
        const { accessToken, } = await this.myAuthHelper.generateTokens(loginDto);
        if(!accessToken)
            throw new AuthExceptions("Token is not generated.", AuthExceptionStatusType.TokenDoesNotExist, HttpStatus.NOT_FOUND);
        return {
            accessToken: accessToken,
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
}
