/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from 'src/repositories/RoomRepository';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { Accommodation } from 'src/accommodations/entities/accommodation.entity';
import { UserRepository } from 'src/repositories/UserRepository';
import { User } from 'src/users/entities/user.entity';
import { ContextModule } from 'src/local-storage-service/local.storage.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Room, Accommodation, User]),
    ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository, AccommodationRepository, UserRepository, ContextModule],
})
export class RoomsModule {}
