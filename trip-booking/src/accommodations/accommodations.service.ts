/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';

@Injectable()
export class AccommodationsService {
  create(createAccommodationDto: CreateAccommodationDto) {
    return 'This action adds a new accommodation' + JSON.stringify(createAccommodationDto);
  }

  findAll() {
    return `This action returns all accommodations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accommodation`;
  }

  update(id: number, updateAccommodationDto: UpdateAccommodationDto) {
    return `This action updates a #${id} accommodation ${JSON.stringify(updateAccommodationDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} accommodation`;
  }
}
