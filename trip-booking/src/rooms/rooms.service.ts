/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from 'src/repositories/RoomRepository';
import { RoomExceptions } from 'src/exceptions-handling/exceptions/room.exceptions';
import { RoomExceptionsStatusType } from 'src/exceptions-handling/exceptions-status-type/room.exceptions.status.type';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(private roomRepository: RoomRepository) {
    
  }

  async create(createRoomDto: CreateRoomDto) {
    const checkRoomExistence = await this.roomRepository.getByLabel(createRoomDto.label);
    if(checkRoomExistence)
      throw new RoomExceptions("Room with this label already exists in this accommodation.", RoomExceptionsStatusType.RoomAlreadyExists);

    const room = new Room({});
    Object.assign(room, createRoomDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.roomRepository.manager.save(Room, room);
  }

  async findAll() {
    return await this.roomRepository.getAll();
  }

  async findOne(id: string) {
    const room = await this.roomRepository.getById(id);
    if(!room)
      throw new RoomExceptions("Room does not exist.", RoomExceptionsStatusType.RoomDoesNotExist);

    return room;
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room ${JSON.stringify(updateRoomDto)}`;
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
          throw new RoomExceptions("User is not soft deleted, therefore, it can not be undeleted.", RoomExceptionsStatusType.RoomIsNotBlocked_SoftDeleted);
        
    return this.roomRepository.hardDelete(id);
  }
}
