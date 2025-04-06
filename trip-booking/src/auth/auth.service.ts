/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/user.exceptions.status.type';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { UserRepository } from 'src/repositories/UserRepository';
import { CurrentUser } from './types/current-user';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { LoginDto } from './dto/login.dto';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto) {
        const { accessToken, } = await this.generateTokens(loginDto);
        if(!accessToken)
            throw new AuthExceptions("Token is not generated.", AuthExceptionStatusType.TokenDoesNotExist);
        return {
            accessToken: accessToken,
        }
    }

    async generateTokens(loginDto: LoginDto) {
        //TODO REFRESH TOKEN
        const user = await this.userRepository.getUserByUsername(loginDto.username);
        if(!user)
            throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordMatch)
            throw new AuthExceptions("Invalid password", AuthExceptionStatusType.InvalidPassword);

        console.log("USER", user);
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

    async validateJwtUser(username: string) {
        const user = await this.userRepository.getUserByUsername(username);
        if(!user)
            throw new UsersExceptions("User not found.", UsersExceptionStatusType.UserDoesNotExist);
    
        const currentUser: CurrentUser = {
            username: user.username,
            role: user.role
        }

        return currentUser;
    }
}
