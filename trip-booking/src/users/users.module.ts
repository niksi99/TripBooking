/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { DataSource } from 'typeorm';
import { Accommodation } from 'src/accommodations/entities/accommodation.entity';
import { AccommodationRepository } from 'src/repositories/AccommodationRepository';
import { ContextModule } from 'src/local-storage-service/local.storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Accommodation]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService, ContextModule, AccommodationRepository,
    {
      provide: UserRepository, 
      useFactory: (dataSource: DataSource) => {
        const baseRepository = dataSource.getRepository(User);
        return new UserRepository(dataSource, baseRepository);
      },
      inject: [DataSource],
    },
  ],
  exports: [UsersService, AccommodationRepository]
})
export class UsersModule {}
