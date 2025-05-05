/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsPositive, Length, Min } from "class-validator";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { AbstactEntity } from "src/database/AbstractEntity";
import { BookedBedLimit } from "src/validators/BookedBedLimitValidator";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Room extends AbstactEntity<Room> {
    @Length(2, 25, { message: 'Last must be between 2 and 25 characters.' })
    @IsNotEmpty()
    @Column()
    label: string;

    @IsPositive({ message: 'Number of beds can\'t be negative or zero.' })
    @IsNotEmpty({ message: 'Number of beds is required.' })
    @IsNotEmpty()
    @Column()
    numberOfBeds: number;

    @Min(0, { message: 'Number of booked beds can\'t be negative.' })
    @BookedBedLimit({ message: 'Number of booked beds can\'t exceed total number of beds.' })
    @Column({ default: 0 })
    numberOfBookedBeds: number;

    @IsPositive()
    @IsNotEmpty()
    @Column()
    floor: number;

    @ManyToOne(() => Accommodation, accommodation => accommodation.myRooms, { onDelete: 'CASCADE' })
    accommodation: Accommodation;
}