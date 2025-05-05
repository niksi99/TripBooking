/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsPositive } from "class-validator";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { AbstactEntity } from "src/database/AbstractEntity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Room extends AbstactEntity<Room> {
    @IsNotEmpty()
    @Column()
    label: string;

    @IsPositive()
    @IsNotEmpty()
    @Column()
    numberOfBeds: number;

    @IsPositive()
    @IsNotEmpty()
    @Column({ default: 0 })
    numberOfBookedBeds: number;

    @IsPositive()
    @IsNotEmpty()
    @Column()
    floor: number;

    @ManyToOne(() => Accommodation, accommodation => accommodation.myRooms, { onDelete: 'CASCADE' })
    accommodation: Accommodation;
}