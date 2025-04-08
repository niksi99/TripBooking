/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { Repository } from "typeorm";


@Injectable()
export class AccommodationRepository extends Repository<Accommodation>{

}