/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../repositories/UserRepository';
import { UsersExceptions } from '../exceptions-handling/exceptions/users.exceptions';
import { UsersExceptionStatusType } from '../exceptions-handling/exceptions-status-type/user.exceptions.status.type';
import { User } from './entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { AuthExceptionStatusType } from 'src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types';
import { AuthExceptions } from 'src/exceptions-handling/exceptions/auth.exceptions';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.userRepository.getUserByEmailOrUsername(createUserDto.email, createUserDto.username);
    if(checkUser?.email === createUserDto.email)
      throw new UsersExceptions("User with this email already exists. ", UsersExceptionStatusType.EmailAlreadyExists);

    if(checkUser?.username === createUserDto.username)
      throw new UsersExceptions("User with this username already exists. ", UsersExceptionStatusType.UsernameAlreadyExists);

    const user = new User({});
    Object.assign(user, createUserDto);
    return this.userRepository.manager.save(User, user);
  }

  async findAll() {
    return await this.userRepository.getAll();
  }

  async findOne(id: string) {
    const myUser = await this.userRepository.getUserById(id);
    if(!myUser)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

    return myUser; 
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkUserExistense = await this.userRepository.getUserById(id);
    if(checkUserExistense == null)
      throw new UsersExceptions("User does not exist", UsersExceptionStatusType.UserDoesNotExist);
    
    if(checkUserExistense.deletedAt !== null)
      throw new UsersExceptions("User is soft deleted, can not be updated.", UsersExceptionStatusType.UserAlreadySoftDeleted);
    
    Object.assign(checkUserExistense, updateUserDto);
    return await this.userRepository.manager.save(User, checkUserExistense);
  }

  async hardDelete(id: string) {
    const user = await this.userRepository.getUserById(id);
    if(!user)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

    if(user.role.toString()  === Role.ADMINISTRATOR.toString())
      throw new AuthExceptions("Administrator can't be deleted!", AuthExceptionStatusType.AdministratorCanNotBeDeleted, HttpStatus.FORBIDDEN);
    return await this.userRepository.hardDeleteUser(id);
  }

  async softDelete(id: string) {
    const user = await this.userRepository.getUserById(id);
    if(user == null)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

    if(user.deletedAt != null)
      throw new UsersExceptions("User is already soft deleted.", UsersExceptionStatusType.UserAlreadySoftDeleted);

    return await this.userRepository.softRemove(user);
  }

  async softUndelete(id: string) {
    const user = await this.userRepository.getUserById(id);
    if(user == null)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

    if(user.deletedAt == null)
      throw new UsersExceptions("User is not soft deleted, therefore, it can not be undeleted.", UsersExceptionStatusType.UserIsNotSoftUndeleted);

    return await this.userRepository.softUndeleteUser(id);
  }

  async hardDeleteUserAndAllHisAccommodation(id: string) {
    const user = await this.userRepository.getUserById(id);

    if(user == null)
      throw new UsersExceptions("User does not exist.", UsersExceptionStatusType.UserDoesNotExist);

    if(user.role.toString() !== Role.ACCOMMODATION_OWNER.toString())
      throw new UsersExceptions("User is not accommodation owner", UsersExceptionStatusType.UserIsNotAccommodationOwner);

    return await this.userRepository.hardDeleteUserAndOwnedAccommodations(user);
  }
}
