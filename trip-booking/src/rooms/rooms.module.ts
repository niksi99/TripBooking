/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from 'src/repositories/RoomRepository';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { Accommodation } from 'src/accommodations/entities/accommodation.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Room, Accommodation]),
    ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository, AccommodationRepository],
})
export class RoomsModule {}
