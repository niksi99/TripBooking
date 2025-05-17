/* eslint-disable prettier/prettier */

import { Test, TestingModule } from "@nestjs/testing";
import { RoomsController } from "./rooms.controller"
import { RoomsService } from "./rooms.service";
import { RoomExceptions } from "../exceptions-handling/exceptions/room.exceptions";
import { RoomExceptionsStatusType } from "../exceptions-handling/exceptions-status-type/room.exceptions.status.type";
import { NotFoundException } from "@nestjs/common";

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
            accommodation: null
        },
        {
            id: "9gr95f64-5717-4562-b3fc-67y63f66afa6",
            label: "Идемо НИИИИИИИИШ",
            numberOfBeds: 5,
            numberOfBookedBeds: 1,
            floor: 6,
            accommodation: null
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
})