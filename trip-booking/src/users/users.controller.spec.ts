/* eslint-disable prettier/prettier */

import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersExceptions } from "../exceptions-handling/exceptions/users.exceptions";
import { UsersExceptionStatusType } from "../exceptions-handling/exceptions-status-type/user.exceptions.status.type";
import { NotFoundException } from "@nestjs/common";

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
        }
    ];

    beforeEach(async () => {
        usersService = {
            findAll: jest.fn(),
            findOne: jest.fn()
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
    });

    describe('findOne', () => {
        it('should return a user from mocked user service', async() => {
            //(usersService.findOne as jest.Mock).mockResolvedValue(mockUsers);
            (usersService.findOne as jest.Mock).mockImplementation((id: string) => {
                return mockUsers.find(user => user.id === id); // Find the user with the given ID
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
});