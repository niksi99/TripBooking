/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from 'src/repositories/RoomRepository';

@Module({
  imports: [
      TypeOrmModule.forFeature([Room]),
    ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
})
export class RoomsModule {}
