/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsController } from './accommodations.controller';
import { Accommodation } from './entities/accommodation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { UserRepository } from 'src/repositories/UserRepository';
import { User } from 'src/users/entities/user.entity';
import { ContextModule } from 'src/local-storage-service/local.storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accommodation, User]),
  ],
  controllers: [AccommodationsController],
  providers: [AccommodationsService, AccommodationRepository, UserRepository, ContextModule],
})
export class AccommodationsModule {}
