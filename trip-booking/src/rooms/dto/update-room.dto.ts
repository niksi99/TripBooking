/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsPositive, Length } from "class-validator";

export class UpdateRoomDto {
    @IsNotEmpty({ message: 'RoomId is required.' })
    roomId: string;

    @IsNotEmpty({ message: 'AccommodationId is required.' })
    accommodationId: string;

    @Length(2, 30, { message: 'Label must be between 2 and 30 characters.' })
    @IsNotEmpty({ message: 'Label is required.' })
    label: string;

    @IsPositive({ message: 'Number of beds can\'t be negative or zero.' })
    @IsNotEmpty({ message: 'Number of beds is required.' })
    @IsNotEmpty()
    numberOfBeds: number;

    @IsPositive({ message: 'Floor can\'t be negative or zero.' })
    @IsNotEmpty({ message: 'Floor is required.' })
    floor: number;
}
