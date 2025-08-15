/* eslint-disable prettier/prettier */

import { Room } from "src/rooms/entities/room.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class RoomRepository extends Repository<Room> {
    constructor(@InjectRepository(Room) private readonly roomRepository: Repository<Room>) {
        super(
            roomRepository.target,
            roomRepository.manager,
            roomRepository.queryRunner
        );
    }

    public async getAll() : Promise<Room[]> {
        return await this.roomRepository.find({
            withDeleted: true,
            relations: ['accommodation']
        });
    }
    

    async getById(id: string) {
        return await this.roomRepository.findOne({
            where: {id: id},
            withDeleted: true,
            relations: ['accommodation']
        });
    } 

    async getByLabel(label: string) {
        return await this.roomRepository.findOne({
            where: {label: label},
            withDeleted: true,
            relations: ['accommodation']
        });
    } 

    async getAllRoomsOfThisAccommodation(id: string): Promise<Room[]> {
        return await this.roomRepository.find({
            where: {
                accommodation: {
                    id: id
                }
            },
            relations: ['accommodation']
        })
    }

    async getRoomFromAccommodationByRoomLabel(accommId: string, roomLabel: string): Promise<Room | null> {
        return await this.roomRepository.findOne({
            where: {
                accommodation: {
                    id: accommId
                },
                label: roomLabel
            },
            relations: ['accommodation']
        })
    }

    public async hardDelete(id: string) {
        return await this.roomRepository.delete({id: id});
    }
    
    public async softDeleteRoom(room: Room) {
        return await this.roomRepository.softRemove(room);
    }
    
    public async softUndelete(id: string){
        return await this.roomRepository.restore(id);
    }

    async saveRoom(room: Room) {
        return await this.roomRepository.save(room);
    }
}