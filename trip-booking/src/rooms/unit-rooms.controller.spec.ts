/* eslint-disable prettier/prettier */

import { Test, TestingModule } from "@nestjs/testing";
import { RoomsController } from "./rooms.controller"
import { RoomsService } from "./rooms.service";
import { RoomExceptions } from "../exceptions-handling/exceptions/room.exceptions";
import { RoomExceptionsStatusType } from "../exceptions-handling/exceptions-status-type/room.exceptions.status.type";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateRoomDto } from "./dto/create-room.dto";
import { AccommodationExceptions } from "../exceptions-handling/exceptions/accommodation.exceptions";
import { AccommodationExceptionsStatusType } from "../exceptions-handling/exceptions-status-type/accommodation.exceptions";

describe('RoomsController UnitTest', () => {
    let roomsController: RoomsController;
    let roomsService: Partial<RoomsService>;

    const mockRooms = [
        {
            id: "3fa85f64-5717-4562-b3fc-67y63f66afa6",
            label: "Моја соба.",
            numberOfBeds: 4,
            numberOfBookedBeds: 2,
            floor: 1,
            accommodation: null,
            deletedAt: null,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
        },
        {
            id: "9gr95f64-5717-4562-b3fc-67y63f66afa6",
            label: "Идемо НИИИИИИИИШ",
            numberOfBeds: 5,
            numberOfBookedBeds: 1,
            floor: 6,
            accommodation: null,
            deletedAt: Date.now,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
        },
    ];

    beforeEach(async () => {
        roomsService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllRoomOfSingleAccommodation: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            hardDelete: jest.fn(),
            softDelete: jest.fn(),
            softUndelete: jest.fn()
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoomsController],
            providers: [
                { provide: RoomsService, useValue: roomsService}
            ]
        }).compile();

        roomsController = module.get<RoomsController>(RoomsController);
    })

    describe('findAll', () => {
        it('should return all users from mocked users service.', async() => {
            (roomsService.findAll as jest.Mock).mockResolvedValue(mockRooms);

            const results = await roomsController.findAll();

            expect(results).toEqual(mockRooms);
            expect(roomsService.findAll).toHaveBeenCalled();            
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (roomsService.findAll as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(roomsController.findAll()).rejects.toBe(errorMock);
        });
    })

    describe('findOne', () => {
        it('should return a room', async() => {
            (roomsService.findOne as jest.Mock).mockImplementation((id: string) => {
                return mockRooms.find(x => x.id === id)
            })

            const result = await roomsController.findOne('3fa85f64-5717-4562-b3fc-67y63f66afa6');

            expect(result).toEqual(mockRooms[0]);
            expect(roomsService.findOne).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-67y63f66afa6');
        })

        it('should throw RoomDoesNotExist', async () => {
            const errorMock = new RoomExceptions('Room does not exist.', RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(errorMock, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room does not exist.');
            (roomsService.findOne as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.findOne('2')).rejects.toThrow(NotFoundException);
            await expect(roomsController.findOne('2')).rejects.toThrow('Room does not exist.');
        })

        it('should throw other errors', async () => {
            const errorMock = new Error('Other error');
            (roomsService.findOne as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(roomsController.findOne('1')).rejects.toBe(errorMock);
        });
    })

    describe('hard-delete', () => {
        it('should hard-delete a rooms', async () => {
            (roomsService.hardDelete as jest.Mock).mockImplementation((id: string) => {
                return mockRooms.find(x => x.id === id);
            })

            const result = await roomsController.hardDelete("9gr95f64-5717-4562-b3fc-67y63f66afa6");

            expect(result).toEqual(mockRooms[1]);
            expect(roomsService.hardDelete).toHaveBeenCalledWith('9gr95f64-5717-4562-b3fc-67y63f66afa6');
        })

        it('should throw DoesRoomExist', async () => {
            const errorMock = new RoomExceptions('Room does not exist.', RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(errorMock, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room does not exist.');
            (roomsService.hardDelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.hardDelete('2')).rejects.toThrow(NotFoundException);
            await expect(roomsController.hardDelete('2')).rejects.toThrow('Room does not exist.');
        })

        it('should throw other error', async () => {
            const errorMock = new Error('Other error');
            (roomsService.hardDelete as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(roomsController.hardDelete('1')).rejects.toBe(errorMock);
        })
    })

    describe('soft-delete', () => {
        it('should soft-delete a rooms', async () => {
            (roomsService.softDelete as jest.Mock).mockImplementation((id: string) => {
                return mockRooms.find(x => x.id === id && x.deletedAt === null);
            })

            const result = await roomsController.softDelete("3fa85f64-5717-4562-b3fc-67y63f66afa6");

            expect(result).toEqual(mockRooms[0]);
            expect(roomsService.softDelete).toHaveBeenCalledWith('3fa85f64-5717-4562-b3fc-67y63f66afa6');
        })

        it('should throw DoesRoomExist', async () => {
            const errorMock = new RoomExceptions('Room does not exist.', RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(errorMock, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room does not exist.');
            (roomsService.softDelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.softDelete('2')).rejects.toThrow(NotFoundException);
            await expect(roomsController.softDelete('2')).rejects.toThrow('Room does not exist.');
        })

        it('should throw Rooms is already soft-deleted.', async () => {
            const errorMock = new RoomExceptions('Room is already block/soft-deleted..', RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted);
            jest.spyOn(errorMock, 'CanRoomBeBlocked_SoftDeleted').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room is already block/soft-deleted.');
            (roomsService.softDelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.softDelete('2')).rejects.toThrow(BadRequestException);
            await expect(roomsController.softDelete('2')).rejects.toThrow('Room is already block/soft-deleted.');
        })

        it('should throw other error', async () => {
            const errorMock = new Error('Other error');
            (roomsService.softDelete as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(roomsController.softDelete('1')).rejects.toBe(errorMock);
        })
    })

    describe('soft-undelete', () => {
        it('should soft-undelete a room', async () => {
            (roomsService.softUndelete as jest.Mock).mockImplementation((id: string) => {
                return mockRooms.find(x => x.id === id && x.deletedAt !== null);
            })

            const result = await roomsController.softUndelete("9gr95f64-5717-4562-b3fc-67y63f66afa6");

            expect(result).toEqual(mockRooms[1]);
            expect(roomsService.softUndelete).toHaveBeenCalledWith('9gr95f64-5717-4562-b3fc-67y63f66afa6');
        })

        it('should throw DoesRoomExist', async () => {
            const errorMock = new RoomExceptions('Room does not exist.', RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(errorMock, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room does not exist.');
            (roomsService.softUndelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.softUndelete('2')).rejects.toThrow(NotFoundException);
            await expect(roomsController.softUndelete('2')).rejects.toThrow('Room does not exist.');
        })

        it('should throw Rooms is already soft-deleted.', async () => {
            const errorMock = new RoomExceptions('Room is not soft deleted, therefore, it can not be undeleted.', RoomExceptionsStatusType.RoomIsBlocked_SoftDeleted);
            jest.spyOn(errorMock, 'IsRoomBlocked').mockReturnValue(true);
            jest.spyOn(errorMock, 'getMessage').mockReturnValue('Room is not soft deleted, therefore, it can not be undeleted.');
            (roomsService.softUndelete as jest.Mock).mockRejectedValue(errorMock);

            await expect(roomsController.softUndelete('2')).rejects.toThrow(BadRequestException);
            await expect(roomsController.softUndelete('2')).rejects.toThrow('Room is not soft deleted, therefore, it can not be undeleted.');
        })

        it('should throw other error', async () => {
            const errorMock = new Error('Other error');
            (roomsService.softUndelete as jest.Mock).mockRejectedValue(errorMock);
      
            await expect(roomsController.softUndelete('1')).rejects.toBe(errorMock);
        })
    })

    describe('create', () => {
            const newRoom: CreateRoomDto = {
                label: 'Собица са плавим плафоном',
                floor: 3,
                numberOfBeds: 2,
                accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
            };
            
            it('should return created room with no errors.', async () => {
                const expectedResult = { id: '7c495f64-5717-4562-b3fc-67y63f66afa1', ...newRoom };
                (roomsService.create as jest.Mock).mockResolvedValue(expectedResult);
                const result = await roomsController.create(newRoom);
    
                expect(result).toEqual(expectedResult);
                expect(roomsService.create).toHaveBeenCalledWith(newRoom);
            })
    
            it('should throw BadRequestException: Accommodation does not exist.', async () => {
                const errorMock = new AccommodationExceptions("Accommodation does not exist.", AccommodationExceptionsStatusType.AccommodationDoesNotExist);
                jest.spyOn(errorMock, 'DoesAccommodationExist').mockReturnValue(true);
                jest.spyOn(errorMock, 'getMessage').mockReturnValue("Accommodation does not exist.");
    
                (roomsService.create as jest.Mock).mockRejectedValue(errorMock);
    
                await expect(roomsController.create(newRoom)).rejects.toThrow(BadRequestException);
                await expect(roomsController.create(newRoom)).rejects.toThrow("Accommodation does not exist.");
            });

            it('should throw BadRequestException: Accommodation is blocked / soft deleted.', async () => {
                const errorMock = new AccommodationExceptions("Accommodation is blocked/soft-deleted.", AccommodationExceptionsStatusType.AccommodationIsBlocked_SoftDeleted);
                jest.spyOn(errorMock, 'IsAccommodationBlocked_SoftDeleted').mockReturnValue(true);
                jest.spyOn(errorMock, 'getMessage').mockReturnValue("Accommodation is blocked/soft-deleted.");
    
                (roomsService.create as jest.Mock).mockRejectedValue(errorMock);
    
                await expect(roomsController.create(newRoom)).rejects.toThrow(BadRequestException);
                await expect(roomsController.create(newRoom)).rejects.toThrow("Accommodation is blocked/soft-deleted.");
            });
    
            it('should throw BadRequestException: Room with this label already exists.', async () => {
                const errorMock = new RoomExceptions("Room with this label already exists in this accommodation.", RoomExceptionsStatusType.RoomAlreadyExists);
                jest.spyOn(errorMock, 'DoesRoomAlreadyExist').mockReturnValue(true);
                jest.spyOn(errorMock, 'getMessage').mockReturnValue("Room with this label already exists in this accommodation.");
    
                (roomsService.create as jest.Mock).mockRejectedValue(errorMock);
    
                await expect(roomsController.create(newRoom)).rejects.toThrow(BadRequestException);
                await expect(roomsController.create(newRoom)).rejects.toThrow("Room with this label already exists in this accommodation.");
            })
    
            it('should throw other errors', async () => {
                const errorMock = new Error('Other error');
                (roomsService.create as jest.Mock).mockRejectedValue(errorMock);
    
                await expect(roomsController.create(newRoom)).rejects.toBe(errorMock);
            });
        })
})