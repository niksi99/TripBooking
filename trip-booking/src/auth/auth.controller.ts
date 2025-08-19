/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Body, Controller, NotFoundException, Post, Res, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { Response } from 'express';
import { AppRoutes } from 'src/routes/app.routes';

@Controller(AppRoutes.BasicAuthRoute)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post(AppRoutes.Login)
  async login(
    @Body() loginDto: LoginDto,
    @Headers() headers,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const loginResult = await this.authService.login(loginDto, headers['accept-language']);
      
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

  @Post(AppRoutes.Logout)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
