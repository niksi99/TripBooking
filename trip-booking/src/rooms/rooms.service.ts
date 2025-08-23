/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpStatus, Injectable, Request } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from 'src/repositories/RoomRepository';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RoomExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/room.exceptions.status.type';
import { Room } from './entities/room.entity';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { AccommodationExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/accommodation.exceptions';
import { I18nService } from 'nestjs-i18n';
import { UsersExceptions } from 'src/exceptions-handling/exceptions/users.exceptions';
import { UsersExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/user.exceptions.status.type';
import { UserRepository } from 'src/repositories/UserRepository';

@Injectable()
export class RoomsService {
  constructor(
    private roomRepository: RoomRepository,
    private accommodationRepository: AccommodationRepository,
    private userRepository: UserRepository,
    private readonly i18n_translations: I18nService
  ) {}

  async create(@Request() request, createRoomDto: CreateRoomDto, lang: string) {
    const checkAccommodationExistence = await this.accommodationRepository.GetAccommodationById(createRoomDto.accommodationId);
    if(!checkAccommodationExistence)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_DOES_NOT_EXIST`, { lang: lang }), 
        AccommodationExceptionsStatusType.AccommodationDoesNotExist, 
        HttpStatus.NOT_FOUND
      );
      
    if(checkAccommodationExistence.deletedAt !== null)
      throw new AccommodationExceptions(
      await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_IS_BLOCKED_SOFTDELETED`, { lang: lang }), 
      AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, 
      HttpStatus.FORBIDDEN
    );
    
    const checkRoomExistence = await this.roomRepository.getRoomFromAccommodationByRoomLabel(createRoomDto.accommodationId, createRoomDto.label);
    if(checkRoomExistence)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_WITH_THIS_LABEL_ALREADY_EXISTS_IN_THIS_ACCOMMODATION`, { lang: lang }), 
        RoomExceptionsStatusType.RoomAlreadyExists, 
        HttpStatus.CONFLICT
      );

    const user = await this.userRepository.getUserByUsername(request.user.username);
    if(!user)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_DOES_NOT_EXIST`, { lang: lang }), 
        UsersExceptionStatusType.UserDoesNotExist
      );

    if(checkAccommodationExistence.owner.id !== user.id)
      throw new UsersExceptions(
        await this.i18n_translations.t(`exceptions.user.USER_IS_NOT_ACCOMMODATION_OWNER_OF_SELECTED_ACCOMMODATION`, { lang: lang }), 
        UsersExceptionStatusType.UserIsNotAccommodationOwnerOfSelectedAccommodation_RoomCreation
      );

    const room = new Room({});
    Object.assign(room, createRoomDto);
    room.accommodation = checkAccommodationExistence
     
    const newRoom = await this.roomRepository.saveRoom(room);
    return newRoom;
  }

  async findAll() {
    return await this.roomRepository.getAll();
  }

  async findAllRoomOfSingleAccommodation(accommodationId: string, lang: string) {
    const accomm = await this.accommodationRepository.GetAccommodationById(accommodationId);
    if(!accomm)
      throw new AccommodationExceptions(
        await this.i18n_translations.t(`exceptions.accommodation.ACCOMMODATION_DOES_NOT_EXIST`, { lang: lang }),
        AccommodationExceptionsStatusType.AccommodationDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    return await this.roomRepository.getAllRoomsOfThisAccommodation(accommodationId);
  }

  async findOne(id: string, lang: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_DOES_NOT_EXIST`, { lang: lang }),
        RoomExceptionsStatusType.RoomDoesNotExist, 
      HttpStatus.NOT_FOUND
    );

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, lang: string) {
    const doesRoomExist = await this.roomRepository.getById(id);
    if(doesRoomExist == null)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_DOES_NOT_EXIST`, { lang: lang }), 
        RoomExceptionsStatusType.RoomDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    if(doesRoomExist.deletedAt != null)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_IS_BLOCKED_SOFT_DELETED`, { lang: lang }),
        RoomExceptionsStatusType.RoomIsBlocked_SoftDeleted, 
        HttpStatus.FORBIDDEN
      );

    const checkRoomLabelExistense = await this.roomRepository.getByLabel(updateRoomDto.label);
    if(checkRoomLabelExistense?.label === updateRoomDto.label)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_WITH_THIS_LABEL_ALREADY_EXISTS_IN_THIS_ACCOMMODATION`, { lang: lang }),
        RoomExceptionsStatusType.RoomAlreadyExists, 
        HttpStatus.CONFLICT
      );
    
    Object.assign(doesRoomExist, updateRoomDto);
    return await this.roomRepository.manager.save(Room, doesRoomExist);
  }

  async hardDelete(id: string, lang: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_DOES_NOT_EXIST`, { lang: lang }),
        RoomExceptionsStatusType.RoomDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    return this.roomRepository.hardDelete(id);
  }

  async softDelete(id: string, lang: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_DOES_NOT_EXIST`, { lang: lang }),
        RoomExceptionsStatusType.RoomDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    if(room.deletedAt != null)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_IS_ALREADY_SOFT_DELETED`, { lang: lang }),
        RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted, 
        HttpStatus.FORBIDDEN
      );

    return this.roomRepository.softDeleteRoom(room);
  }
  
  async softUndelete(id: string, lang: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_DOES_NOT_EXIST`, { lang: lang }),
        RoomExceptionsStatusType.RoomDoesNotExist, 
        HttpStatus.NOT_FOUND
      );

    if(room.deletedAt == null)
      throw new RoomExceptions(
        await this.i18n_translations.t(`exceptions.room.ROOM_IS_NOT_SOFT_DELETED`, { lang: lang }),
        RoomExceptionsStatusType.RoomIsNotBlocked_SoftDeleted, 
        HttpStatus.FORBIDDEN
      );
        
    return this.roomRepository.hardDelete(id);
  }
}
