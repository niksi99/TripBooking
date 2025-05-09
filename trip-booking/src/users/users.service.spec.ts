/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */

import { UsersExceptions } from "../exceptions-handling/exceptions/users.exceptions";
import { UserRepository } from "../repositories/UserRepository"
import { UsersService } from "./users.service";

describe('UsersService', () => {
    let usersRepository: UserRepository;
    let usersService: UsersService;

    const mockedUsers = [
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

    beforeEach(() => {
        usersRepository = {
            getAll: jest.fn(),
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
            getUserByEmailOrUsername: jest.fn(),
            hardDeleteUser: jest.fn(),
            softDeleteUser: jest.fn(),
            softUndeleteUser: jest.fn(),
            hardDeleteUserAndOwnedAccommodations: jest.fn(),
        } as unknown as UserRepository;

        usersService = new UsersService(usersRepository);
    })

    describe('findAll', () => {
        it('should return all users', async () => {
            (usersRepository.getAll as jest.Mock).mockResolvedValue(mockedUsers);

            const result = await usersService.findAll();

            expect(usersRepository.getAll).toHaveBeenCalled();
            expect(result).toEqual(mockedUsers);
        })
    })

    describe('findOne', () => {
        it('should return user by id without any error', async () => {
            (usersRepository.getUserById as jest.Mock).mockImplementation((id: string) => {
                return mockedUsers.find(user => user.id === id); 
            });

            const result = await usersService.findOne("3fa85f64-5717-4562-b3fc-2c963f66afa6");

            expect(usersRepository.getUserById).toHaveBeenCalled();
            expect(result).toEqual(mockedUsers[0]);
        })

        it('should throw UserExceptions if user does not exist.', async () => {
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(null);

            await expect(usersService.findOne('non-existing-id')).rejects.toThrow(UsersExceptions);
            await expect(usersService.findOne('non-existing-id')).rejects.toThrow("User does not exist.");
        })
    })
})