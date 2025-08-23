/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Request, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseGuards, Headers, UseFilters } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AppRoutes } from 'src/routes/app.routes';
import { RoomsExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/rooms.exceptions.filter';
import { AccommodationsExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/accommodation.exceptions.filter';
import { AuthExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/auth.exceptions.filter';
import { UsersExceptionsFilter } from 'src/exceptions-handling/exceptions-filters/users.exceptions.filter';

@Controller(AppRoutes.BasicRoomsRoute)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UseFilters(RoomsExceptionsFilter, AuthExceptionsFilter, AccommodationsExceptionsFilter, UsersExceptionsFilter)
  @Post()
  async create(@Request() request, @Body() createRoomDto: CreateRoomDto, @Headers() headers) {
    return await this.roomsService.create(request, createRoomDto, headers['accept-language']);
  }

  @UseFilters(RoomsExceptionsFilter)
  @Get(AppRoutes.GetAllRoute)
  async findAll() {
    return await this.roomsService.findAll(); 
  }

  @UseFilters(AccommodationsExceptionsFilter)
  @Get(AppRoutes.GetAllRoomsOfSingleAccommodation)
  async findAllRoomsOfSingleAccommodation(@Param('accommodationId') accommodationId: string, @Headers() headers) {
    return await this.roomsService.findAllRoomOfSingleAccommodation(accommodationId, headers['accept-language']); 
  }

  @UseFilters(RoomsExceptionsFilter)
  @Get(AppRoutes.GetByIdRoute)
  async findOne(@Param('id') id: string, @Headers() headers) {
    return await this.roomsService.findOne(id, headers['accept-language']);
  }

  @Roles(Role.ACCOMMODATION_OWNER, Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(AppRoutes.UpdateRoute)
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, @Headers() headers) {
    try {
      return await this.roomsService.update(id, updateRoomDto, headers['accept-language']); 
    } catch (error) {
      switch(true) {
        case error instanceof RoomExceptions:
          if(error.DoesRoomExist())
            throw new NotFoundException(error.getMessage());
          if(error.IsRoomBlocked_SoftDeleted())
            throw new BadRequestException(error.getMessage());
          if(error.DoesRoomAlreadyExist())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ACCOMMODATION_OWNER, Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(AppRoutes.HardDeleteRoute)
  async hardDelete(@Param('id') id: string, @Headers() headers) {
    try {
      return await this.roomsService.hardDelete(id, headers['accept-language']);
    } 
    catch (error) {
      switch(true) {
        case error instanceof RoomExceptions:
          if(error.DoesRoomExist())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ACCOMMODATION_OWNER, Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(AppRoutes.SoftDeleteRoute)
  async softDelete(@Param('id') id: string, @Headers() headers) {
    try {
      return await this.roomsService.softDelete(id, headers['accept-language']);
    } 
    catch (error) {
      switch(true) {
        case error instanceof RoomExceptions:
          if(error.DoesRoomExist())
            throw new NotFoundException(error.getMessage());
          if(error.CanRoomBeBlocked_SoftDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ACCOMMODATION_OWNER, Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(AppRoutes.SoftUndeleteRoute)
  async softUndelete(@Param('id') id: string, @Headers() headers) {
    try {
      return await this.roomsService.softUndelete(id, headers['accept-language']);
    } 
    catch (error) {
      switch(true) {
        case error instanceof RoomExceptions:
          if(error.DoesRoomExist())
            throw new NotFoundException(error.getMessage());
          if(error.IsRoomBlocked())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }
}
