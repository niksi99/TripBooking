/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Res, Headers, UseGuards, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AppRoutes } from 'src/routes/app.routes';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/auth.exceptions.filter';
import { UsersExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/users.exceptions.filter';

@Controller(AppRoutes.BasicAuthRoute)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @UseFilters(AuthExceptionsFilter, UsersExceptionsFilter)
  @Post(AppRoutes.Login)
  async login(
    @Body() loginDto: LoginDto,
    @Headers() headers,
    @Res({ passthrough: true }) response: Response
  ) {
      const result = await this.authService.login(loginDto, headers['accept-language']);

      response.cookie('access_token', result.accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
      });

      return {
        message: result.message,
        statusCode: result.statusCode
      }
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(AuthExceptionsFilter)
  @Post(AppRoutes.Logout)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
