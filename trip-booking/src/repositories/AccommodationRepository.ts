/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Accommodation } from "src/accommodations/entities/accommodation.entity";
import { Repository } from "typeorm";


@Injectable()
export class AccommodationRepository extends Repository<Accommodation> {
    constructor(
            @InjectRepository(Accommodation) 
            private accommodationRepository: Repository<Accommodation>,
        )
        {
            super(
                accommodationRepository.target,
                accommodationRepository.manager,
                accommodationRepository.queryRunner
            );
        }

    public async GetAllAccommodations() {
        return this.accommodationRepository.find({
            withDeleted: true,
            relations: ['myRooms', 'appliedUsers', 'owner']
        })
    }

    public async GetAccommodationById(id: string) {
        return this.accommodationRepository.findOne({
            where: {id: id},
            withDeleted: true,
            relations: ['myRooms', 'appliedUsers']
        })
    }

    public async GetAccommodationByName(name: string) {
        return this.accommodationRepository.findOne({
            where: {name: name},
            withDeleted: true,
            relations: ['myRooms', 'appliedUsers']
        })
    }

    public async GetAccommByItsLocation(lat: number, lng: number) {
        return this.accommodationRepository.findOne({
            where: {
                location: {lat: lat, lng: lng}
            },
            withDeleted: true,
            relations: ['myRooms', 'appliedUsers']
        })
    }

    public async GetAllAccommodationsOfThisUser(username: string): Promise<Accommodation[]> {
        return await this.accommodationRepository
            .createQueryBuilder('accommodation')
            .leftJoin('accommodation', 'user')
            .where('user.username = :username', {username})
            .getMany();
    }
}