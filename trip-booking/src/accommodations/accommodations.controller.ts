/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, UseFilters } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AppRoutes } from '../routes/app.routes';
import { AccommodationsExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/accommodation.exceptions.filter';
import { UsersExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/users.exceptions.filter';
import { AuthExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/auth.exceptions.filter';

@Controller(AppRoutes.BasicAcommodationRoute)
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(AccommodationsExceptionsFilter, UsersExceptionsFilter, AuthExceptionsFilter)
  @Post(AppRoutes.CreateRoute)
  async create(@Request() request, @Body() createAccommodationDto: CreateAccommodationDto) {
    return this.accommodationsService.create(request, createAccommodationDto);
  }

  @Roles(Role.PASSENGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(AccommodationsExceptionsFilter, UsersExceptionsFilter, AuthExceptionsFilter)
  @Patch(AppRoutes.BookRoomsOfSingleAccommodation)
  async bookAccommodation(@Request() request, @Param('accommId') accomId: string) {
    return await this.accommodationsService.bookAccommodation(request, accomId);
  }

  @Roles(Role.PASSENGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(AccommodationsExceptionsFilter, UsersExceptionsFilter, AuthExceptionsFilter)
  @Patch(AppRoutes.UnbookAccommodation)
  async unbookAccommodation(@Request() request, @Param('accommId') accomId: string) {
    return await this.accommodationsService.unBookAccommodation(request, accomId);  
  }

  @UseFilters(AccommodationsExceptionsFilter)
  @Get(AppRoutes.GetAllRoute)
  async findAll() {
    return await this.accommodationsService.findAll();
  }

  @UseFilters(AccommodationsExceptionsFilter)
  @Get(AppRoutes.GetByIdRoute)
  findOne(@Param('id') id: string) {
    return this.accommodationsService.findOne(id);
  }

  @Patch(AppRoutes.UpdateRoute)
  update(@Param('id') id: string, @Body() updateAccommodationDto: UpdateAccommodationDto) {
    return this.accommodationsService.update(+id, updateAccommodationDto);
  }

  @Delete(AppRoutes.HardDeleteRoute)
  remove(@Param('id') id: string) {
    return this.accommodationsService.remove(+id);
  }

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(AccommodationsExceptionsFilter, UsersExceptionsFilter, AuthExceptionsFilter)
  @Patch(AppRoutes.SoftDeleteRoute)
    async softDelete(@Request() request, @Param('id') id: string) {
      return await this.accommodationsService.softDelete(request, id);
    }

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(AccommodationsExceptionsFilter, UsersExceptionsFilter, AuthExceptionsFilter)
  @Patch(AppRoutes.SoftUndeleteRoute)
  async softUndelete(@Request() request, @Param('id') id: string) {
    return await this.accommodationsService.softUnDelete(request, id);
  }
}
