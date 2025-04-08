/* eslint-disable prettier/prettier */

import { Room } from "src/rooms/entities/room.entity";
import { ElementalRepository } from "./ElementalRepository";
import { Repository } from "typeorm";

export class RoomRepository extends ElementalRepository<Room> {
    constructor(private readonly roomRepository: Repository<Room>) {
        super(roomRepository);
    }

    async getByLabel(label: string) {
        return await this.roomRepository.findOne({
            where: {label: label},
            withDeleted: true
        });
    } 
}