/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, Request } from '@nestjs/common';
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
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class AccommodationsService {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async create(@Request() request, createAccommodationDto: CreateAccommodationDto) {
    if(!request)
      throw new AuthExceptions("User is not logged in", AuthExceptionStatusType.UserIsNotLoggedIn, HttpStatus.UNAUTHORIZED);
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    console.log("USER FROM ACC SERVICE", user);
    if(!user)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist)

    if(user.role !== Role.ACCOMMODATION_OWNER)
      throw new UsersExceptions("User is not accommodaiton owner", UsersExceptionStatusType.UserIsNotAccommodationOwner);

    const checkAccommExistence = await this.accommodationRepository.GetAccommByItsLocation(createAccommodationDto.location.lat, createAccommodationDto.location.lng);
    if(checkAccommExistence)
      throw new AccommodationExceptions("Accommodation already exist on this location", AccommodationExceptionsStatusType.AccommodationOnThisLocationAlreadyExists, HttpStatus.CONFLICT);
    
    const accomm = new Accommodation({});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    accomm.owner = request.user.username;
    Object.assign(accomm, createAccommodationDto);
    console.log("\nUSER FROM ACC SERVICE", user);
    console.log("ACCOMM FROM ACC SERVICE", accomm);
    return await this.accommodationRepository.saveEntity(accomm);
  }

  async findAll() {
    return await this.accommodationRepository.GetAllAccommodations();
  }

  async findOne(id: string) {
    const accomm = await this.accommodationRepository.GetAccommodationById(id);
    if(!accomm) 
      throw new AccommodationExceptions("Accommodation does no exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist, HttpStatus.NOT_FOUND);

    return accomm;
  }

  update(id: number, updateAccommodationDto: UpdateAccommodationDto) {
    return `This action updates a #${id} accommodation ${JSON.stringify(updateAccommodationDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} accommodation`;
  }

  async bookAccommodation(@Request() request, accommId: string) {
    if(!request)
      throw new AuthExceptions("User is not logged in", AuthExceptionStatusType.UserIsNotLoggedIn, HttpStatus.UNAUTHORIZED);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist)

    if(user.role.toString() !== Role.PASSENGER.toString())
      throw new UsersExceptions("User is not passenger", UsersExceptionStatusType.UserIsNotPassenger);

    const accom = await this.accommodationRepository.GetAccommodationById(accommId);
    if(!accom)
      throw new AccommodationExceptions("Accommodation does not exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist, HttpStatus.NOT_FOUND);

    if(accom.deletedAt !== null)
      throw new AccommodationExceptions("Accommodation is blocked_SoftDeleted", AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, HttpStatus.NOT_FOUND);

    accom.appliedUsers.forEach(element => {
      if(element === user)
        throw new AccommodationExceptions("Users has already booked this accommodation.", AccommodationExceptionsStatusType.UserHasAlreadyBookedAccommodation, HttpStatus.CONFLICT);
    });

    user.accommHistory.push(accom);
    accom.appliedUsers.push(user);

    return accom;
  }

  async unBookAccommodation(@Request() request, accommId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist)

    if(user.role.toString() !== Role.PASSENGER.toString())
      throw new UsersExceptions("User is not passenger", UsersExceptionStatusType.UserIsNotPassenger);

    const accom = await this.accommodationRepository.GetAccommodationById(accommId);
    if(!accom)
      throw new AccommodationExceptions("Accommodation does not exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist, HttpStatus.NOT_FOUND);

    if(accom.deletedAt !== null)
      throw new AccommodationExceptions("Accommodation is blocked_SoftDeleted", AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, HttpStatus.FORBIDDEN);

    accom.appliedUsers.forEach(element => {
      if(element !== user)
        throw new AccommodationExceptions("Users has not booked this accommodation at all. Invalid method.", AccommodationExceptionsStatusType.UserHasNotBookedAccommodation, HttpStatus.BAD_REQUEST);
      else
      accom.appliedUsers = accom.appliedUsers.filter(u => u.id !== user.id);
    });

    user.accommHistory = user.accommHistory.filter(a => a.id !== accom.id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.accommodationRepository.save(accom);
    await this.userRepository.save(user);
  }
}
