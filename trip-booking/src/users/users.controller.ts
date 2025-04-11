/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.DoesEmailAlreadyExist())
            throw new BadRequestException(error.getMessage());
          if (error.DoesUsernameAlreadyExist())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Get('get-all')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update(id, updateUserDto);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.DoesUsernameAlreadyExist())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/hard-delete/:id')
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.hardDelete(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          break;
        case error instanceof AuthExceptions:
          if (error.CanAdministratorBeDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('/hard-delete-with-accommodation/:id')
  async hardDeleteUserWithAccommodation(@Param('id') id: string) {
    try {
      return this.usersService.hardDeleteUserAndAllHisAccommodation(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserAccommodationOwner())
            throw new BadRequestException(error.getMessage());
          break;
        case error instanceof AuthExceptions:
          if (error.CanAdministratorBeDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Patch('/soft-delete/:id')
  async softDelete(@Param('id') id: string) {
    try {
      return this.usersService.softDelete(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserSoftDeleted())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Patch('/soft-undelete/:id')
  async softUndelete(@Param('id') id: string) {
    try {
      return this.usersService.softUndelete(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsNotUserSoftDeleted())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }
}
