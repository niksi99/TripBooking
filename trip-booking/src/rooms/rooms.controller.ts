/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ACCOMMODATION_OWNER, Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    try { 
      return await this.roomsService.create(createRoomDto);
    } 
    catch (error) {
      switch(true) {
        case error instanceof AccommodationExceptions:
          if(error.DoesAccommodationExist())
            throw new BadRequestException(error.getMessage());
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

  @Get()
  async findAll() {
    try {
      return await this.roomsService.findAll(); 
    } catch (error) {
      throw error;
    }
  }

  @Get('/all-rooms-of-single-accommodation')
  async findAllRoomsOfSingleAccommodation(accommodationId: string) {
    try {
      return await this.roomsService.findAllRoomOfSingleAccommodation(accommodationId); 
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.roomsService.findOne(id);
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
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.roomsService.update(id, updateRoomDto); 
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
  async hardDelete(@Param('id') id: string) {
    try {
      return await this.roomsService.hardDelete(id);
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
  @Delete('/soft-delete/:id')
  async softDelete(@Param('id') id: string) {
    try {
      return await this.roomsService.softDelete(id);
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
  @Delete('/soft-undelete/:id')
  async softUndelete(@Param('id') id: string) {
    try {
      return await this.roomsService.softUndelete(id);
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
