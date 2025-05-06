/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNotEmptyObject, Length } from "class-validator";
import { MyLocation } from "src/locations/location";

export class CreateAccommodationDto {
    @IsNotEmpty({ message: 'Name is required.' })
    @Length(2, 25, { message: 'Last must be between 2 and 25 characters.' })
    name: string;

    @IsNotEmptyObject({}, { message: 'Location is required.' })
    location: MyLocation;
}
