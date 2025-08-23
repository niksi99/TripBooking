/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Post, Body, Patch, Request, Param, Delete, BadRequestException, NotFoundException, UseGuards, Headers, UseFilters } from '@nestjs/common';
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
import { UsersExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/users.exceptions.filter';
import { AuthExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/auth.exceptions.filter';
import { AccommodationsExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/accommodation.exceptions.filter';

@Controller(AppRoutes.BasicUsersRoute)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(AppRoutes.CreateRoute)
  @UseFilters(UsersExceptionsFilter)
  async create(@Body() createUserDto: CreateUserDto, @Headers() headers) {
    return await this.usersService.create(createUserDto, headers['accept-language']);
  }

  @Get(AppRoutes.GetAllRoute)
  @UseFilters(UsersExceptionsFilter)
  async findAll() {
    return await this.usersService.findAll(); 
  }

  @Get(AppRoutes.GetByIdRoute)
  @UseFilters(UsersExceptionsFilter)
  async findOne(@Param('id') id: string, @Headers() headers) {
    return await this.usersService.findOne(id, headers['accept-language']);
  }

  @Patch(AppRoutes.UpdateRoute)
  @UseFilters(UsersExceptionsFilter)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Headers() headers) {
    return await this.usersService.update(id, updateUserDto, headers['accept-language']);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter)
  @Delete(AppRoutes.HardDeleteRoute)
  async remove(@Param('id') id: string, @Headers() headers) {
    return await this.usersService.hardDelete(id, headers['accept-language']);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter, AccommodationsExceptionsFilter)
  @Patch(AppRoutes.SoftDeleteRoute)
  async softDelete(@Request() request, @Param('id') id: string, @Headers() headers) {
    return await this.usersService.softDelete(request, id, headers['accept-language']);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter, AccommodationsExceptionsFilter)
  @Patch(AppRoutes.SoftUndeleteRoute)
  async softUndelete(@Request() request, @Param('id') id: string, @Headers() headers) {
    return await this.usersService.softUndelete(request, id, headers['accept-language']);
  }
}
