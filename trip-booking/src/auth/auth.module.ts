/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { UserRepository } from 'src/repositories/UserRepository';
import { UsersService } from 'src/users/users.service';
import { JwtStragy } from './strategies/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthHelper } from 'src/helpers/auth.helper';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UsersService, JwtStragy, AuthHelper],
})
export class AuthModule {}
