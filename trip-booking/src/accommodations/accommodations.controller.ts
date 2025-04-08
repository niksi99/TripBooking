/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Roles(Role.ACCOMMODATION_OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() request, @Body() createAccommodationDto: CreateAccommodationDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("userMine:", request.user);
    return this.accommodationsService.create(request, createAccommodationDto);
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
