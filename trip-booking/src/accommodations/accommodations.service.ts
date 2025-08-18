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
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AccommodationsService {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly userRepository: UserRepository,
    private readonly i18n_translations: I18nService
  ) {}

  async create(@Request() request, createAccommodationDto: CreateAccommodationDto, lang: string) {
    if(!request)
      throw new AuthExceptions(
        await this.i18n_translations.t(`exceptions.auth.USER_IS_NOT_LOGGED_IN`, { lang: lang }), 
        AuthExceptionStatusType.UserIsNotLoggedIn,
        HttpStatus.UNAUTHORIZED
      );
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }), 
        UsersExceptionStatusType.UserDoesNotExist
      );

    if(user.role !== Role.ACCOMMODATION_OWNER)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_IS_NOT_ACCOMMODATION_OWNER`, { lang: lang }), 
        UsersExceptionStatusType.UserIsNotAccommodationOwner
      );

    const checkAccommExistence = await this.accommodationRepository.GetAccommByItsLocation(createAccommodationDto.location.lat, createAccommodationDto.location.lng);
    if(checkAccommExistence)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_ALREADY_EXIST_ON_THIS_LOCATION`, { lang: lang }),
        AccommodationExceptionsStatusType.AccommodationOnThisLocationAlreadyExists, 
        HttpStatus.CONFLICT
      );
    
    const accomm = new Accommodation({});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    accomm.owner = request.user.username;
    Object.assign(accomm, createAccommodationDto);
    return await this.accommodationRepository.manager.save(Accommodation, accomm);
  }

  async findAll() {
    return await this.accommodationRepository.GetAllAccommodations();
  }

  async findOne(id: string, lang: string) {
    const accomm = await this.accommodationRepository.GetAccommodationById(id);
    if(!accomm) 
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_DOES_NOT_EXIST`, { lang: lang }),
        AccommodationExceptionsStatusType.AccommodationDoesNotExist,
        HttpStatus.NOT_FOUND
      );

    return accomm;
  }

  update(id: number, updateAccommodationDto: UpdateAccommodationDto) {
    return `This action updates a #${id} accommodation ${JSON.stringify(updateAccommodationDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} accommodation`;
  }

  async bookAccommodation(@Request() request, accommId: string, lang: string) {
    console.log("accommId", accommId);
    if(!request)
      throw new AuthExceptions(
        await this.i18n_translations.t(`exceptions.auth.TOKEN_IS_NOT_GENERATED`, { lang: lang }),
        AuthExceptionStatusType.UserIsNotLoggedIn, 
        HttpStatus.UNAUTHORIZED
      );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }),
        UsersExceptionStatusType.UserDoesNotExist
      )

    if(user.role.toString() !== Role.PASSENGER.toString())
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_IS_NOT_PASSENGER`, { lang: lang }),
        UsersExceptionStatusType.UserIsNotPassenger
      );

    const accom = await this.accommodationRepository.GetAccommodationById(accommId);
    if(!accom)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_DOES_NOT_EXIST`, { lang: lang }), 
        AccommodationExceptionsStatusType.AccommodationDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    if(accom.deletedAt !== null)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_IS_BLOCKED_SOFTDELETED`, { lang: lang }),  
        AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, 
        HttpStatus.NOT_FOUND
      );

    accom.arivalDate = new Date(Date.now());

    if (accom.appliedUsers?.some(element => element.id === user.id)) {
      throw new AccommodationExceptions(
        this.i18n_translations.t(`exceptions.accommodation.USER_HAS_ALREADY_BOOKED_THIS_ACCOMMODATION`, { lang }),
        AccommodationExceptionsStatusType.UserHasAlreadyBookedAccommodation,
        HttpStatus.CONFLICT
      );
    }

    user.accommHistory.push(accom);
    accom.appliedUsers.push(user);

    const safeAccom = {
      id: accom.id,
      name: accom.name,
      location: accom.location,
      myRooms: accom.myRooms,
      appliedUsers: accom.appliedUsers?.map(u => ({
        id: u.id,
        username: u.username, // only expose minimal user info
      })),
      owner: accom.owner,
      arivalDate: accom.arivalDate,
      departureDate: accom.departureDate,
    };

    return safeAccom;
  }

  async unBookAccommodation(@Request() request, accommId: string, lang: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }),
        UsersExceptionStatusType.UserDoesNotExist
      )

    if(user.role.toString() !== Role.PASSENGER.toString())
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }), 
        UsersExceptionStatusType.UserIsNotPassenger
      );

    const accom = await this.accommodationRepository.GetAccommodationById(accommId);
    if(!accom)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_DOES_NOT_EXIST`, { lang: lang }),
        AccommodationExceptionsStatusType.AccommodationDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    if(accom.deletedAt !== null)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_IS_BLOCKED_SOFTDELETED`, { lang: lang }),
        AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, 
        HttpStatus.FORBIDDEN
      );

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    accom.appliedUsers.forEach(async element => {
      console.log("element", element);
      if(element.id !== user.id)
        throw new AccommodationExceptions(
          await this.i18n_translations.t(`exceptions.accommodation.USER_HAS_NOT_BOOKED_THIS_ACCOMMODATION_AT_ALL`, { lang: lang }), 
          AccommodationExceptionsStatusType.UserHasNotBookedAccommodation, 
          HttpStatus.BAD_REQUEST);
      else
        accom.appliedUsers = accom.appliedUsers.filter(u => u.id !== user.id);
    });
    
    user.accommHistory = user.accommHistory.filter(a => a.id !== accom.id);

    await this.accommodationRepository.manager.save(accom);
    await this.userRepository.save(user);
  }
}
