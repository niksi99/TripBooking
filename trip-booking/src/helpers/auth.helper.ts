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

@Injectable()
export class AuthHelper {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    public async generateTokens(loginDto: LoginDto) {
            //TODO REFRESH TOKEN
            const user = await this.userRepository.getUserByUsername(loginDto?.username);
            if(!user)
                throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);
    
            if(user.deletedAt !== null)
                throw new UsersExceptions("User is soft-deleted ie. blocked.", UsersExceptionStatusType.UserAlreadySoftDeleted)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
            if(!isPasswordMatch)
                throw new AuthExceptions("Invalid password", AuthExceptionStatusType.InvalidPassword, HttpStatus.FORBIDDEN);
    
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