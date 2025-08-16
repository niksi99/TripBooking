/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-useless-catch */
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseGuards, Headers } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { AppRoutes } from 'src/routes/app.routes';

@Controller(AppRoutes.BasicRoomsRoute)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Headers() headers) {
    try { 
      return await this.roomsService.create(createRoomDto, headers['accept-language']);
    } 
    catch (error) {
      switch(true) {
        case error instanceof AccommodationExceptions:
          if(error.DoesAccommodationExist())
            throw new NotFoundException(error.getMessage());
          if(error.IsAccommodationBlocked_SoftDeleted())
            throw new BadRequestException(error.getMessage());
          break;
        case error instanceof RoomExceptions:
          if(error.DoesRoomAlreadyExist())
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
      return await this.roomsService.findAll(); 
    } catch (error) {
      throw error;
    }
  }

  @Get(AppRoutes.GetAllRoomsOfSingleAccommodation)
  async findAllRoomsOfSingleAccommodation(@Param('accommodationId') accommodationId: string, @Headers() headers) {
    try {
      return await this.roomsService.findAllRoomOfSingleAccommodation(accommodationId, headers['accept-language']); 
    } catch (error) {
        switch(true) {
          case error instanceof AccommodationExceptions:
            if(error.DoesAccommodationExist())
              throw new NotFoundException(error.getMessage());
            break;
          default:
            throw error;
        }
    }
  }

  @Get(AppRoutes.GetByIdRoute)
  async findOne(@Param('id') id: string, @Headers() headers) {
    try {
      return await this.roomsService.findOne(id, headers['accept-language']);
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
  @Patch(':id')
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
  @Delete('/hard-delete/:id')
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
  @Patch('/soft-delete/:id')
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
  @Patch('/soft-undelete/:id')
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
