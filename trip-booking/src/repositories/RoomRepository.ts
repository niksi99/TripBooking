/* eslint-disable prettier/prettier */

import { Room } from "src/rooms/entities/room.entity";
import { ElementalRepository } from "./ElementalRepository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class RoomRepository extends ElementalRepository<Room> {
    constructor(@InjectRepository(Room) private readonly roomRepository: Repository<Room>) {
        super(roomRepository);
    }

    async getByLabel(label: string) {
        return await this.roomRepository.findOne({
            where: {label: label},
            withDeleted: true
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

    async saveRoom(room: Room) {
        return await this.roomRepository.save(room);
      }
}