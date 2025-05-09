/* eslint-disable prettier/prettier */

import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersExceptions } from "../exceptions-handling/exceptions/users.exceptions";
import { UsersExceptionStatusType } from "../exceptions-handling/exceptions-status-type/user.exceptions.status.type";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthExceptions } from "../exceptions-handling/exceptions/auth.exceptions";
import { AuthExceptionStatusType } from "../exceptions-handling/exceptions-status-type/auth.exceptions.status.types";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "../auth/enums/role.enum";

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: Partial<UsersService>;

    const mockUsers = [
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john@example.com',
            role: 'USER',
            password: 'hashedpass',
            accommHistory: [],
            softDeleted: false
        },
        {
            id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'Мирко',
            lastName: 'Јанић',
            username: 'МиркоМирко',
            email: 'mirko.mirko@gmail.com',
            role: 'USER',
            password: 'МиркоМирко',
            accommHistory: [],
            softDeleted: false
        },
        {
            id: '99a85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'Ања',
            lastName: 'Милинковић',
            username: 'АњаАњаАња',
            email: 'anjanjaanja@gmail.com',
            role: 'USER',
            password: 'АњаАњаАња',
            accommHistory: [],
            softDeleted: true
        }
    ];

    beforeEach(async () => {
        usersService = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
            softUndelete: jest.fn(),
            hardDeleteUserAndAllHisAccommodation: jest.fn(),
            create: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: usersService}
            ]
        }).compile();

        usersController = module.get<UsersController>(UsersController);
    })

    describe('findAll', () => {
        it('should return all users from mocked users service.', async() => {
            (usersService.findAll as jest.Mock).mockResolvedValue(mockUsers);

            const results = await usersController.findAll();

            expect(results).toEqual(mockUsers);
            expect(usersService.findAll).toHaveBeenCalled();            
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.findAll as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(usersController.findAll()).rejects.toBe(errorMock);
        });
    });

    describe('findOne', () => {
        it('should return a user from mocked user service', async() => {
            //(usersService.findOne as jest.Mock).mockResolvedValue(mockUsers);
            (usersService.findOne as jest.Mock).mockImplementation((id: string) => {
                return mockUsers.find(user => user.id === id); 
            });

            const result = await usersController.findOne('3fa85f64-5717-4562-b3fc-2c963f66afa6');

            expect(result).toEqual(mockUsers[0]);
            expect(usersService.findOne).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        })

        it('should throw NotFoundException if IsUserExisting from UsersExceptions is TRUE', async() => {
            const errorMock = new UsersExceptions('User not found', UsersExceptionStatusType.UserDoesNotExist);
            jest.spyOn(errorMock, 'IsUserExisting').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User not found');
            (usersService.findOne as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.findOne('2')).rejects.toThrow(NotFoundException);
            await expect(usersController.findOne('2')).rejects.toThrow('User not found');
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.findOne as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(usersController.findOne('1')).rejects.toBe(errorMock);
        });
    })

    describe('softDelete', () => {
        it('should return soft-deteled user.', async () => {
            (usersService.softDelete as jest.Mock).mockImplementation((id: string) => {
                const user = mockUsers.find(user => user.id === id && user.softDeleted === false);
                if(user)
                    user.softDeleted = true;
                return user;
            })

            const result = await usersController.softDelete('3fa85f64-5717-4562-b3fc-2c963f66afa6');

            expect(result).toEqual(mockUsers[0]);
            expect(usersService.softDelete).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        })

        it('should throw NotFoundException if IsUserExisting from UsersExceptions is TRUE', async () => {
            const errorMock = new UsersExceptions('User not found', UsersExceptionStatusType.UserDoesNotExist);
            jest.spyOn(errorMock, 'IsUserExisting').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User not found');
            (usersService.softDelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.softDelete('2')).rejects.toThrow(NotFoundException);
            await expect(usersController.softDelete('2')).rejects.toThrow('User not found');
        })
        
        it('should throw BadRequestException if IsUserSoftDeleted is TRUE', async () => {
            const errorMock = new UsersExceptions('User is already soft-deleted / blocked', UsersExceptionStatusType.UserAlreadySoftDeleted);
            jest.spyOn(errorMock, 'IsUserSoftDeleted').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User is already soft-deleted / blocked');
            (usersService.softDelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.softDelete('99a85f64-5717-4562-b3fc-2c963f66afa6')).rejects.toThrow(BadRequestException);
            await expect(usersController.softDelete('99a85f64-5717-4562-b3fc-2c963f66afa6')).rejects.toThrow('User is already soft-deleted / blocked');
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.softDelete as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(usersController.softDelete('1')).rejects.toBe(errorMock);
        });
    })

    describe('softUndelete', () => {
        it('should return soft-undeteled user.', async () => {
            (usersService.softUndelete as jest.Mock).mockImplementation((id: string) => {
                const user = mockUsers.find(user => user.id === id && user.softDeleted === true);
                if(user)
                    user.softDeleted = false;
                return user;
            })

            const result = await usersController.softUndelete('99a85f64-5717-4562-b3fc-2c963f66afa6');

            expect(result).toEqual(mockUsers[2]);
            expect(usersService.softUndelete).toHaveBeenCalledWith('99a85f64-5717-4562-b3fc-2c963f66afa6');
        })

        it('should throw NotFoundException is IsUserExisting === TRUE', async () => {
            const errorMock = new UsersExceptions("User not found", UsersExceptionStatusType.UserDoesNotExist);
            jest.spyOn(errorMock, 'IsUserExisting').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User not found');
            
            (usersService.softUndelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.softUndelete("23")).rejects.toThrow(NotFoundException);
            await expect(usersController.softUndelete("23")).rejects.toThrow("User not found");
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.softUndelete as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(usersController.softUndelete('1')).rejects.toBe(errorMock);
        });
    })

    describe('hardDeleteUserWithAccommodation', () => {
        it('should return hard-deleted.', async () => {
            (usersService.hardDeleteUserAndAllHisAccommodation as jest.Mock).mockImplementation((id: string) => {
                return mockUsers.find(user => user.id === id && user.role != 'ADMINISTRATOR');
            })

            const result = await usersController.hardDeleteUserWithAccommodation('3fa85f64-5717-4562-b3fc-2c963f66afa6');

            expect(result).toEqual(mockUsers[0]);
            expect(usersService.hardDeleteUserAndAllHisAccommodation).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        })

        it('should throw NotFoundException if IsUserExisting from UsersExceptions is TRUE', async () => {
            const errorMock = new UsersExceptions('User not found', UsersExceptionStatusType.UserDoesNotExist);
            jest.spyOn(errorMock, 'IsUserExisting').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User not found');
            (usersService.hardDeleteUserAndAllHisAccommodation as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow(NotFoundException);
            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow('User not found');
        })

        it('should throw BadRequestException if IsUserAccommodationOwner from UsersExceptions is FALSE', async () => {
            const errorMock = new UsersExceptions('User is not accommodation owner', UsersExceptionStatusType.UserIsNotAccommodationOwner);
            jest.spyOn(errorMock, 'IsUserAccommodationOwner').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('User is not accommodation owner');
            (usersService.hardDeleteUserAndAllHisAccommodation as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow(BadRequestException);
            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow('User is not accommodation owner');
        })

        it('should throw BadRequestException if CanAdministratorBeDeleted from AuthExceptions is FALSE', async () => {
            const errorMock = new AuthExceptions('Administrator can not be deleted.', AuthExceptionStatusType.AdministratorCanNotBeDeleted);
            jest.spyOn(errorMock, 'CanAdministratorBeDeleted').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Administrator can not be deleted.');
            (usersService.hardDeleteUserAndAllHisAccommodation as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow(BadRequestException);
            await expect(usersController.hardDeleteUserWithAccommodation('2')).rejects.toThrow('Administrator can not be deleted.');
        })


        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.hardDeleteUserAndAllHisAccommodation as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(usersController.hardDeleteUserWithAccommodation('1')).rejects.toBe(errorMock);
        });
    })

    describe('create', () => {
        const newUser: CreateUserDto = {
            firstName: 'Лана',
            lastName: 'Миланковић',
            username: 'LanaNa',
            password: 'LanaNa',
            email: 'lana.milankovic@gmail.com',
            role: Role.ADMINISTRATOR
        };
        
        it('should return created user with no errors.', async () => {
            const expectedResult = { id: '1', ...newUser };
            (usersService.create as jest.Mock).mockResolvedValue(expectedResult);
            const result = await usersController.create(newUser);

            expect(result).toEqual(expectedResult);
            expect(usersService.create).toHaveBeenCalledWith(newUser);
        })

        it('should throw BadRequestException if DoesEmailAlreadyExist from UserExpections is TRUE', async () => {
            const errorMock = new UsersExceptions("Email already exists", UsersExceptionStatusType.EmailAlreadyExists);
            jest.spyOn(errorMock, 'DoesEmailAlreadyExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue("Email already exists");

            (usersService.create as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.create(newUser)).rejects.toThrow(BadRequestException);
            await expect(usersController.create(newUser)).rejects.toThrow("Email already exists");
        });

        it('should throw BadRequestException if DoesUsernameAlreadyExist from UserExceptions is TRUE', async () => {
            const errorMock = new UsersExceptions("Username already exists", UsersExceptionStatusType.EmailAlreadyExists);
            jest.spyOn(errorMock, 'DoesUserAlreadyExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue("Username already exists");

            (usersService.create as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.create(newUser)).rejects.toThrow(BadRequestException);
            await expect(usersController.create(newUser)).rejects.toThrow("Username already exists");
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (usersService.create as jest.Mock).mockRejectedValue(errorMock);

            await expect(usersController.create(newUser)).rejects.toBe(errorMock);
        });
    })
});