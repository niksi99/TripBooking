/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => {
        const baseRepository = dataSource.getRepository(User);
        return new UserRepository(dataSource, baseRepository);
      },
      inject: [DataSource],
    },
  ],
})
export class UsersModule {}
