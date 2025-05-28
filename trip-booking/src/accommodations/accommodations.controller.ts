/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Request, UseGuards, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  //@Roles(Role.ACCOMMODATION_OWNER)
  //@UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Post('/create-acc')
  async create(@Request() request, @Body() createAccommodationDto: CreateAccommodationDto) {
    try {
      return this.accommodationsService.create(request, createAccommodationDto); 
    } catch (error) {
      switch(true) {
        case error instanceof AuthExceptions:
          if (error.IsUserLoggedOut())
            throw new NotFoundException(error.getMessage());
          break;
        case error instanceof UsersExceptions:
          if (error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if (error.IsUserAccommodationOwner())
            throw new NotFoundException(error.getMessage());
          break;
        case error instanceof AccommodationExceptions:
          if(error.IsLocationAlreadyBusy())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/book-accommodation')
  async bookAccommodation(@Request() request, accomId: string) {
    try {
      return await this.accommodationsService.bookAccommodation(request, accomId);  
    } 
    catch (error) {
      switch(true) {
        case error instanceof AuthExceptions:
          if(error.IsUserLoggedIn())
            throw new ForbiddenException(error.getMessage());
          break;
        case error instanceof UsersExceptions:
          if(error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if(error.IsUserPassenger())
            throw new UnauthorizedException(error.getMessage());
          break;
        case error instanceof AccommodationExceptions:
          if(error.DoesAccommodationExist())
            throw new NotFoundException(error.getMessage());
          if(error.IsAccommodationBlocked_SoftDeleted())
            throw new NotFoundException(error.getMessage());
          if(error.HasAccommodationBeedlreadyBooked())
            throw new BadRequestException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/unbook-accommodation')
  async unbookAccommodation(@Request() request, accomId: string) {
    try {
      return await this.accommodationsService.unBookAccommodation(request, accomId);  
    } 
    catch (error) {
      switch(true) {
        case error instanceof UsersExceptions:
          if(error.IsUserExisting())
            throw new NotFoundException(error.getMessage());
          if(error.IsUserPassenger())
            throw new UnauthorizedException(error.getMessage());
          break;
        case error instanceof AccommodationExceptions:
          if(error.DoesAccommodationExist())
            throw new NotFoundException(error.getMessage());
          if(error.IsAccommodationBlocked_SoftDeleted())
            throw new BadRequestException(error.getMessage());
          if(error.HasNotAccommodationBeedBooked())
            throw new BadRequestException(error.getMessage());
          break;
        default: 
          throw error;
      }
    }
  }

  @Get('/get-all')
  async findAll() {
    return await this.accommodationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.accommodationsService.findOne(id);
    } 
    catch (error) {
      switch(true) {
        case error instanceof AccommodationExceptions:
          if (error.DoesAccommodationExist())
            throw new NotFoundException(error.getMessage());
          break;
        default:
          throw error;
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccommodationDto: UpdateAccommodationDto) {
    return this.accommodationsService.update(+id, updateAccommodationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accommodationsService.remove(+id);
  }
}
