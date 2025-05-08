/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsPositive, Length, Min } from "class-validator";
import { Accommodation } from "../../accommodations/entities/accommodation.entity";
import { AbstactEntity } from "../../database/AbstractEntity";
import { BookedBedLimit } from "../../validators/BookedBedLimitValidator";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Room extends AbstactEntity<Room> {
    @Length(2, 25, { message: 'Last must be between 2 and 25 characters.' })
    @IsNotEmpty({ message: 'Label is required.' })
    @Column()
    label: string;

    @IsPositive({ message: 'Number of beds can\'t be negative or zero.' })
    @IsNotEmpty({ message: 'Number of beds is required.' })
    @Column()
    numberOfBeds: number;

    @Min(0, { message: 'Number of booked beds can\'t be negative.' })
    @BookedBedLimit({ message: 'Number of booked beds can\'t exceed total number of beds.' })
    @Column({ default: 0 })
    numberOfBookedBeds: number;

    @IsPositive({ message: 'Floor can\'t be negative or zero.' })
    @IsNotEmpty({ message: 'Floor is required.' })
    @Column()
    floor: number;

    @ManyToOne(() => Accommodation, accommodation => accommodation.myRooms, { onDelete: 'CASCADE' })
    accommodation: Accommodation;
}