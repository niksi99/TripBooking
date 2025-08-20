/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Post, Headers, Body, Patch, Param, Delete, NotFoundException, Request, UseGuards, BadRequestException, ForbiddenException, UnauthorizedException, UseFilters } from '@nestjs/common';
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
  async create(@Request() request, @Body() createAccommodationDto: CreateAccommodationDto, @Headers() headers) {
    console.log("FROM ACCOM CONTROLLER: CREATE ACCOM. ");
    return this.accommodationsService.create(request, createAccommodationDto, headers['accept-language']);
    // try {
    //   return this.accommodationsService.create(request, createAccommodationDto, headers['accept-language']); 
    // } catch (error) {
    //   switch(true) {
    //     case error instanceof AuthExceptions:
    //       if (error.IsUserLoggedOut())
    //         throw new NotFoundException(error.getMessage());
    //       break;
    //     case error instanceof UsersExceptions:
    //       if (error.IsUserExisting())
    //         throw new NotFoundException(error.getMessage());
    //       if (error.IsUserAccommodationOwner())
    //         throw new NotFoundException(error.getMessage());
    //       break;
    //     case error instanceof AccommodationExceptions:
    //       if(error.IsLocationAlreadyBusy())
    //         throw new BadRequestException(error.getMessage());
    //       break;
    //     default:
    //       throw error;
    //   }
    // }
  }

  @Roles(Role.PASSENGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(AppRoutes.BookRoomsOfSingleAccommodation)
  async bookAccommodation(@Request() request, @Param('accommId') accomId: string, @Headers() headers) {
    try {
      return await this.accommodationsService.bookAccommodation(request, accomId, headers['accept-language']);  
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

  @Roles(Role.PASSENGER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(AppRoutes.UnbookAccommodation)
  async unbookAccommodation(@Request() request, @Param('accommId') accomId: string,  @Headers() headers) {
    try {
      return await this.accommodationsService.unBookAccommodation(request, accomId, headers['accept-language']);  
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

  @Get(AppRoutes.GetAllRoute)
  async findAll() {
    try {
      return await this.accommodationsService.findAll();
    }
    catch (error) {
      throw error;
    }
  }

  @Get(AppRoutes.GetByIdRoute)
  @UseFilters(AccommodationsExceptionsFilter)
  findOne(@Param('id') id: string, @Headers() headers) {
    return this.accommodationsService.findOne(id, headers['accept-language']);
    // try {
    //   return this.accommodationsService.findOne(id, headers['accept-language']);
    // } 
    // catch (error) {
    //   switch(true) {
    //     case error instanceof AccommodationExceptions:
    //       if (error.DoesAccommodationExist())
    //         throw new NotFoundException(error.getMessage());
    //       break;
    //     default:
    //       throw error;
    //   }
    // }
  }

  @Patch(AppRoutes.UpdateRoute)
  update(@Param('id') id: string, @Body() updateAccommodationDto: UpdateAccommodationDto) {
    return this.accommodationsService.update(+id, updateAccommodationDto);
  }

  @Delete(AppRoutes.HardDeleteRoute)
  remove(@Param('id') id: string) {
    return this.accommodationsService.remove(+id);
  }
}
