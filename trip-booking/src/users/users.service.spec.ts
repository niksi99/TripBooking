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
            softRemove: jest.fn(),
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

    describe('hardDelete', () => {
        it('should return deleted user if user exists and is not admin', async () => {
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(mockedUsers[0]);
            (usersRepository.hardDeleteUser as jest.Mock).mockResolvedValue(mockedUsers[0]);
        
            const result = await usersService.hardDelete(mockedUsers[0].id);
        
            expect(usersRepository.getUserById).toHaveBeenCalledWith(mockedUsers[0].id);
            expect(usersRepository.hardDeleteUser).toHaveBeenCalledWith(mockedUsers[0].id);
            expect(result).toEqual(mockedUsers[0]);
          });

        it('should throw UserExceptions if user does not exist.', async () => {
            (usersRepository.hardDeleteUser as jest.Mock).mockResolvedValue(null);

            await expect(usersService.hardDelete('non-existing-id')).rejects.toThrow(UsersExceptions);
            await expect(usersService.hardDelete('non-existing-id')).rejects.toThrow("User does not exist.");

            expect(usersRepository.getUserById).toHaveBeenCalledWith('non-existing-id');
        })

        it('should throw UserExceptions if UserIsAdministrator.is TRUE', async () => {
            const adminUser = { ...mockedUsers[1], role: "ADMINISTRATOR" };
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(adminUser);

            await expect(usersService.hardDelete(adminUser.id)).rejects.toThrow(UsersExceptions);
            await expect(usersService.hardDelete(adminUser.id)).rejects.toThrow("Administrator can't be deleted!");

            expect(usersRepository.getUserById).toHaveBeenCalledWith(adminUser.id);
        })
    })

    describe('softDelete', () => {
        it('should return deleted user if user exists and is not admin', async () => {
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(mockedUsers[0]);
            (usersRepository.softRemove  as jest.Mock).mockResolvedValue(mockedUsers[0]);
        
            const result = await usersService.softDelete(mockedUsers[0].id);
        
            expect(usersRepository.getUserById).toHaveBeenCalledWith(mockedUsers[0].id);
            expect(usersRepository.softRemove).toHaveBeenCalledWith(mockedUsers[0]);
            expect(result).toEqual(mockedUsers[0]);
          });

        it('should throw UserExceptions if user does not exist.', async () => {
            (usersRepository.softDeleteUser as jest.Mock).mockResolvedValue(null);

            await expect(usersService.softDelete('non-existing-id')).rejects.toThrow(UsersExceptions);
            await expect(usersService.softDelete('non-existing-id')).rejects.toThrow("User does not exist.");

            expect(usersRepository.getUserById).toHaveBeenCalledWith('non-existing-id');
        })

        it('should throw UserExceptions if UserAlreadySoftDeleted is TRUE', async () => {
            const toSoftDelete = { ...mockedUsers[2] };
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(toSoftDelete);

            await expect(usersService.softDelete(toSoftDelete.id)).rejects.toThrow(UsersExceptions);
            await expect(usersService.softDelete(toSoftDelete.id)).rejects.toThrow("User is already soft deleted.");

            expect(usersRepository.getUserById).toHaveBeenCalledWith(toSoftDelete.id);
        })
    })

    describe('softUndelete', () => {
        it('should return deleted user if user exists and is not admin', async () => {
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(mockedUsers[2]);
            (usersRepository.softUndeleteUser  as jest.Mock).mockResolvedValue(mockedUsers[2]);
        
            const result = await usersService.softDelete(mockedUsers[2].id);
        
            expect(usersRepository.getUserById).toHaveBeenCalledWith(mockedUsers[2].id);
            expect(usersRepository.softUndeleteUser).toHaveBeenCalledWith(mockedUsers[2].id);
            expect(result).toEqual(mockedUsers[2]);
          });

        it('should throw UserExceptions if user does not exist.', async () => {
            (usersRepository.softUndeleteUser as jest.Mock).mockResolvedValue(null);

            await expect(usersService.softUndelete('non-existing-id')).rejects.toThrow(UsersExceptions);
            await expect(usersService.softUndelete('non-existing-id')).rejects.toThrow("User does not exist.");

            expect(usersRepository.getUserById).toHaveBeenCalledWith('non-existing-id');
        })

        it('should throw UserExceptions if UserIsNotSoftUndeleted is TRUE', async () => {
            const toSoftUndelete = { ...mockedUsers[2] };
            (usersRepository.getUserById as jest.Mock).mockResolvedValue(toSoftUndelete);

            await expect(usersService.softDelete(toSoftUndelete.id)).rejects.toThrow(UsersExceptions);
            await expect(usersService.softDelete(toSoftUndelete.id)).rejects.toThrow("User is not soft deleted, therefore, it can not be undeleted.");

            expect(usersRepository.getUserById).toHaveBeenCalledWith(toSoftUndelete.id);
        })
    })
})