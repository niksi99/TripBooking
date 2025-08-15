/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class RoomsService {
  constructor(
    private roomRepository: RoomRepository,
    private accommodationRepository: AccommodationRepository,
    private readonly i18n_translations: I18nService
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const checkAccommodationExistence = await this.accommodationRepository.GetAccommodationById(createRoomDto.accommodationId);
    if(!checkAccommodationExistence)
      throw new AccommodationExceptions("Accommodation does not exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist, HttpStatus.NOT_FOUND);

    if(checkAccommodationExistence.deletedAt !== null)
      throw new AccommodationExceptions("Accommodation is blocked/soft-deleted.", AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted, HttpStatus.FORBIDDEN);

    const checkRoomExistence = await this.roomRepository.getRoomFromAccommodationByRoomLabel(createRoomDto.accommodationId, createRoomDto.label);
    if(checkRoomExistence)
      throw new RoomExceptions("Room with this label already exists in this accommodation.", RoomExceptionsStatusType.RoomAlreadyExists, HttpStatus.CONFLICT);

    const room = new Room({});
    Object.assign(room, createRoomDto);
    room.accommodation = checkAccommodationExistence
     
    const newRoom = await this.roomRepository.saveRoom(room);
    return newRoom;
  }

  async findAll() {
    return await this.roomRepository.getAll();
  }

  async findAllRoomOfSingleAccommodation(accommodationId: string) {
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

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const doesRoomExist = await this.roomRepository.getById(id);
    if(doesRoomExist == null)
      throw new RoomExceptions("Room does not exist", RoomExceptionsStatusType.RoomDoesNotExist, HttpStatus.NOT_FOUND);

    if(doesRoomExist.deletedAt != null)
      throw new RoomExceptions("Room is already block/soft-deleted.", RoomExceptionsStatusType.RoomIsBlocked_SoftDeleted, HttpStatus.FORBIDDEN);

    const checkRoomLabelExistense = await this.roomRepository.getByLabel(updateRoomDto.label);
    if(checkRoomLabelExistense?.label === updateRoomDto.label)
      throw new RoomExceptions("Room with this label already exists. ", RoomExceptionsStatusType.RoomAlreadyExists, HttpStatus.CONFLICT);
    
    Object.assign(doesRoomExist, updateRoomDto);
    return await this.roomRepository.manager.save(Room, doesRoomExist);
  }

  async hardDelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist, HttpStatus.NOT_FOUND);

    return this.roomRepository.hardDelete(id);
  }

  async softDelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist, HttpStatus.NOT_FOUND);

    if(room.deletedAt != null)
          throw new RoomExceptions("Room is already soft deleted.", RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted, HttpStatus.FORBIDDEN);

    return this.roomRepository.softDeleteRoom(room);
  }
  
  async softUndelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist, HttpStatus.NOT_FOUND);

    if(room.deletedAt == null)
          throw new RoomExceptions("Room is not soft deleted, therefore, it can not be undeleted.", RoomExceptionsStatusType.RoomIsNotBlocked_SoftDeleted, HttpStatus.FORBIDDEN);
        
    return this.roomRepository.hardDelete(id);
  }
}
