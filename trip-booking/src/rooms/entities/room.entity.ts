/* eslint-disable prettier/prettier */
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { AbstactEntity } from "src/database/AbstractEntity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Room extends AbstactEntity<Room> {
    @Column()
    label: string;

    @Column()
    numberOfBeds: number;

    @Column({ default: 0 })
    numberOfBookedBeds: number;

    @Column()
    floor: number;

    @ManyToOne(() => Accommodation, accommodation => accommodation.myRooms, { onDelete: 'CASCADE' })
    accommodation: Accommodation;
}