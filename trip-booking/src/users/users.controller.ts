/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppRoutes } from 'src/routes/app.routes';
import { UsersExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/users.exceptions.filter';
import { AuthExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/auth.exceptions.filter';
import { AccommodationsExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/accommodation.exceptions.filter';

@Controller(AppRoutes.BasicUsersRoute)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(AppRoutes.CreateRoute)
  @UseFilters(UsersExceptionsFilter)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(AppRoutes.GetAllRoute)
  @UseFilters(UsersExceptionsFilter)
  async findAll() {
    return await this.usersService.findAll(); 
  }

  @Get(AppRoutes.GetByIdRoute)
  @UseFilters(UsersExceptionsFilter)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(AppRoutes.UpdateRoute)
  @UseFilters(UsersExceptionsFilter)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter)
  @Delete(AppRoutes.HardDeleteRoute)
  async remove(@Param('id') id: string) {
    return await this.usersService.hardDelete(id);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter, AccommodationsExceptionsFilter)
  @Patch(AppRoutes.SoftDeleteRoute)
  async softDelete(@Request() request, @Param('id') id: string) {
    return await this.usersService.softDelete(request, id);
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(UsersExceptionsFilter, AuthExceptionsFilter, AccommodationsExceptionsFilter)
  @Patch(AppRoutes.SoftUndeleteRoute)
  async softUndelete(@Request() request, @Param('id') id: string) {
    return await this.usersService.softUndelete(request, id);
  }
}
