/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from 'src/repositories/RoomRepository';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RoomExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/room.exceptions.status.type';
import { Room } from './entities/room.entity';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { AccommodationExceptions } from 'src/exceptions-handling/exceptions/accommodation.exceptions';
import { AccommodationExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/accommodation.exceptions';

@Injectable()
export class RoomsService {
  constructor(
    private roomRepository: RoomRepository,
    private accommodationRepository: AccommodationRepository
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const checkAccommodationExistence = await this.accommodationRepository.GetAccommodationById(createRoomDto.accommodationId);
    if(!checkAccommodationExistence)
      throw new AccommodationExceptions("Accommodation does not exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist);

    const checkRoomExistence = await this.roomRepository.getRoomFromAccommodationByRoomLabel(createRoomDto.accommodationId, createRoomDto.label);
    if(checkRoomExistence)
      throw new RoomExceptions("Room with this label already exists in this accommodation.", RoomExceptionsStatusType.RoomAlreadyExists);

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

  async findOne(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist);

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const doesRoomExist = await this.roomRepository.getById(id);
    if(doesRoomExist == null)
      throw new RoomExceptions("Room does not exist", RoomExceptionsStatusType.RoomDoesNotExist);

    if(doesRoomExist.deletedAt != null)
      throw new RoomExceptions("Room is already block/soft-deleted.", RoomExceptionsStatusType.RoomIsBlocked_SoftDeleted);

    const checkRoomLabelExistense = await this.roomRepository.getByLabel(updateRoomDto.label);
    if(checkRoomLabelExistense?.label === updateRoomDto.label)
      throw new RoomExceptions("Room with this label already exists. ", RoomExceptionsStatusType.RoomAlreadyExists);
    
    Object.assign(doesRoomExist, updateRoomDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.roomRepository.manager.save(Room, doesRoomExist);
  }

  async hardDelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist);

    return this.roomRepository.hardDelete(id);
  }

  async softDelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist);

    if(room.deletedAt != null)
          throw new RoomExceptions("Room is already soft deleted.", RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted);

    return this.roomRepository.softDelete(room);
  }
  
  async softUndelete(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist);

    if(room.deletedAt == null)
          throw new RoomExceptions("Room is not soft deleted, therefore, it can not be undeleted.", RoomExceptionsStatusType.RoomIsNotBlocked_SoftDeleted);
        
    return this.roomRepository.hardDelete(id);
  }
}
