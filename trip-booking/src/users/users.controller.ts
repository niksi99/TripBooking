/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersExceptions } from '../exceptions-handling/exceptions/users.exceptions';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthExceptions } from '../exceptions-handling/exceptions/auth.exceptions';
import { AppRoutes } from 'src/routes/app.routes';

@Controller(AppRoutes.BasicUsersRoute)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(AppRoutes.CreateRoute)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
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

  @Get(AppRoutes.GetAllRoute)
  async findAll() {
    try {
      return await this.usersService.findAll(); 
    } 
    catch (error) {
      throw error;
    }
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserSoftDeleted())
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
  @Delete(AppRoutes.HardDeleteRoute)
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.hardDelete(id);
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
  @Delete(AppRoutes.HardDeleteWithAccommodationRoute+":id")
  async hardDeleteUserWithAccommodation(@Param('id') id: string) {
    try {
      return await this.usersService.hardDeleteUserAndAllHisAccommodation(id);
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

  @Patch(AppRoutes.SoftDeleteRoute)
  async softDelete(@Param('id') id: string) {
    try {
      return await this.usersService.softDelete(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserSoftDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Patch(AppRoutes.SoftUndeleteRoute)
  async softUndelete(@Param('id') id: string) {
    try {
      return await this.usersService.softUndelete(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsNotUserSoftDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }
}
