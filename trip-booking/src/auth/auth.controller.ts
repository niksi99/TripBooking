/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, NotFoundException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const loginResult = await this.authService.login(loginDto);
      
      response.cookie('access_token', loginResult.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      return { message: 'Logged in successfully'}
    } catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserSoftDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        case error instanceof AuthExceptions:
          if (error.IsPasswordInvalid())
            throw new BadRequestException(error.getMessage());
          if (error.DoesTokenExist())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
