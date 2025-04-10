/* eslint-disable prettier/prettier */
import { Injectable, Request } from '@nestjs/common';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { AccommodationExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/accommodation.exceptions';
import { UserRepository } from 'src/repositories/UserRepository';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { UsersExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/user.exceptions.status.type';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
import { Accommodation } from './entities/accommodation.entity';

@Injectable()
export class AccommodationsService {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async create(@Request() request, createAccommodationDto: CreateAccommodationDto) {
    if(!request)
      throw new AuthExceptions("User is not logged in", AuthExceptionStatusType.UserIsNotLoggedIn);
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist)

    const checkAccommExistence = await this.accommodationRepository.GetAccommByItsLocation(createAccommodationDto.location.lat, createAccommodationDto.location.lng);
    if(checkAccommExistence)
      throw new AccommodationExceptions("Accommodation already exist on this location", AccommodationExceptionsStatusType.AccommodationOnThisLocationAlreadyExists);
    
    const accomm = new Accommodation({});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    accomm.owner = request.user.username;
    Object.assign(accomm, createAccommodationDto);

    return await this.accommodationRepository.saveEntity(accomm);
  }

  async findAll() {
    return await this.accommodationRepository.GetAllAccommodations();
  }

  async findOne(id: string) {
    const accomm = await this.accommodationRepository.GetAccommodationById(id);
    if(!accomm) 
      throw new AccommodationExceptions("Accommodation does no exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist);

    return accomm;
  }

  update(id: number, updateAccommodationDto: UpdateAccommodationDto) {
    return `This action updates a #${id} accommodation ${JSON.stringify(updateAccommodationDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} accommodation`;
  }
}
