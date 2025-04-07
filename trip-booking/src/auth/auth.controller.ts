/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log(loginDto);
      return await this.authService.login(loginDto)
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
}
