/* eslint-disable prettier/prettier */

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { RoomsService } from "./rooms.service";
import { App } from "supertest/types";
import { RoomsController } from "./rooms.controller";
import { RoomExceptions } from "../exceptions-handling/exceptions/room.exceptions";
import { RoomExceptionsStatusType } from "src/exceptions-handling/exceptions-status-type/room.exceptions.status.type";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { MockJwtAuthGuard, MockRolesGuard } from "../auth/guards/mocked/mocked-auth.guards";
import { RolesGuard } from "../auth/guards/roles/roles.guard";

jest.setTimeout(15000);
describe('Rooms Controller e2e', () => {
    let app: INestApplication<App>;

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
            deletedAt: null,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
        },
    ];

    const mockedRoomSelvice =  {
        findAll: jest.fn().mockReturnValue(mockRooms),
        findOne: jest.fn().mockImplementation((id: string) => {
            return mockRooms.find(room => room.id === id);
        }),
        hardDelete: jest.fn().mockImplementation((id: string) => {
            return mockRooms.filter(room => room.id !== id)
        }),
        softDelete: jest.fn().mockImplementation((id: string) => {
            return mockRooms.find(room => room.id ===id && room.deletedAt === null);
        }),
        softUndelete: jest.fn().mockImplementation((id: string) => {
            return mockRooms.find(room => room.id ===id && room.deletedAt !== null);
        })
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [RoomsController],
            providers: [
              {
                provide: RoomsService,
                useValue: mockedRoomSelvice,
              },
            ],
          })
          .overrideGuard(JwtAuthGuard)
          .useClass(MockJwtAuthGuard)
          .overrideGuard(RolesGuard)
          .useClass(MockRolesGuard)
          .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    })

    describe("GET /rooms", () => {
        it('GET /rooms - should return all rooms', async () => {
            const response = await request(app.getHttpServer())
             .get('/rooms');
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRooms);
        }, 10000);

        it('GET /rooms - should return error', async () => {
            jest.spyOn(mockedRoomSelvice, 'findAll').mockImplementation(() => {
                throw new Error('Unexpected error');
              });
            
              const response = await request(app.getHttpServer())
                .get('/rooms');
            
              expect(response.status).toBe(500);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              expect(response.body.message).toBe('Internal server error');
        }, 10000);
    })

    describe("GET a room", () => {
        it('GET /room - should return a room', async () => {
        const room = {
            id: "3fa85f64-5717-4562-b3fc-67y63f66afa6",
            label: "Моја соба.",
            numberOfBeds: 4,
            numberOfBookedBeds: 2,
            floor: 1,
            accommodation: null,
            deletedAt: null,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
            };

        jest.spyOn(mockedRoomSelvice, 'findOne').mockResolvedValue(room);

        const response = await request(app.getHttpServer())
            .get(`/rooms/${room.id}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual(room);
        }, 10000);

        it('GET /rooms/:id - thorw RoomDoeNotExist', async () => {
            const error = new RoomExceptions("", RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(error, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(error, 'getMessage').mockReturnValue('Room not found');

            jest.spyOn(mockedRoomSelvice, 'findOne').mockImplementation(() => {
                throw error;
            });

            const response = await request(app.getHttpServer())
                .get('/rooms/some-invalid-id');

            expect(response.status).toBe(404);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Room not found');
        })

        it('GET /rooms/:id - should return 500 on unexpected error', async () => {
            jest.spyOn(mockedRoomSelvice, 'findOne').mockImplementation(() => {
              throw new Error('Unexpected error');
            });
          
            const response = await request(app.getHttpServer())
              .get('/rooms/some-invalid-id');
          
            expect(response.status).toBe(500);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Internal server error'); // or your global exception message
          });
    })

    describe("Hard delete a room", () => {
        it('hard-delede a room - should hard delte it', async () => {
        const room = {
            id: "3fa85f64-5717-4562-b3fc-67y63f66afa6",
            label: "Моја соба.",
            numberOfBeds: 4,
            numberOfBookedBeds: 2,
            floor: 1,
            accommodation: null,
            deletedAt: null,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
            };

        jest.spyOn(mockedRoomSelvice, 'hardDelete').mockResolvedValue(room);

        const response = await request(app.getHttpServer())
            .delete(`/rooms/hard-delete/${room.id}`);
    
        console.log("RESPONSE HARDDELETE", response);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(room);
        }, 10000);

        it('DELETE /rooms/hard-delete/:id - thorw RoomDoeNotExist', async () => {
            const error = new RoomExceptions("", RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(error, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(error, 'getMessage').mockReturnValue('Room not found');

            jest.spyOn(mockedRoomSelvice, 'hardDelete').mockImplementation(() => {
                throw error;
            });

            const response = await request(app.getHttpServer())
                .delete('/rooms/hard-delete/some-invalid-id');

            expect(response.status).toBe(404);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Room not found');
        })

        it('DELETE /rooms/hard-delete/:id - should return 500 on unexpected error', async () => {
            jest.spyOn(mockedRoomSelvice, 'hardDelete').mockImplementation(() => {
              throw new Error('Unexpected error');
            });
          
            const response = await request(app.getHttpServer())
              .delete('/rooms/hard-delete/some-invalid-id');
          
            expect(response.status).toBe(500);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Internal server error'); // or your global exception message
          });
    })

    describe("Soft delete a room", () => {
        it('soft-delede a room - should soft delte it', async () => {
        const room = {
            id: "3fa85f64-5717-4562-b3fc-67y63f66afa6",
            label: "Моја соба.",
            numberOfBeds: 4,
            numberOfBookedBeds: 2,
            floor: 1,
            accommodation: null,
            deletedAt: null,
            accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
            };

        jest.spyOn(mockedRoomSelvice, 'softDelete').mockResolvedValue(room);

        const response = await request(app.getHttpServer())
            .patch(`/rooms/soft-delete/${room.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(room);
        }, 10000);

        it('PATCH /rooms/soft-delete/:id - thorw RoomDoeNotExist', async () => {
            const error = new RoomExceptions("", RoomExceptionsStatusType.RoomDoesNotExist);
            jest.spyOn(error, 'DoesRoomExist').mockReturnValue(true);
            jest.spyOn(error, 'getMessage').mockReturnValue('Room not found');

            jest.spyOn(mockedRoomSelvice, 'softDelete').mockImplementation(() => {
                throw error;
            });

            const response = await request(app.getHttpServer())
                .patch('/rooms/soft-delete/some-invalid-id');

            expect(response.status).toBe(404);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Room not found');
        })

        it('PATCH /rooms/soft-delete/:id - thorw RoomDoeNotExist', async () => {
            const room = {
                id: "3fa85f64-5717-4562-b3fc-67y63f66afa6",
                label: "Моја соба.",
                numberOfBeds: 4,
                numberOfBookedBeds: 2,
                floor: 1,
                accommodation: null,
                deletedAt: Date.now(),
                accommodationId: "7a495f64-5717-4562-b3fc-67y63f66afa8"
            };

            const error = new RoomExceptions("", RoomExceptionsStatusType.RoomCanNotBeBlocked_SoftDeleted);
            jest.spyOn(error, 'CanRoomBeBlocked_SoftDeleted').mockReturnValue(true);
            jest.spyOn(error, 'getMessage').mockReturnValue('Room is already soft deleted.');

            jest.spyOn(mockedRoomSelvice, 'softDelete').mockImplementation(() => {
                throw error;
            });

            const response = await request(app.getHttpServer())
                .patch(`/rooms/soft-delete/${room.id}`);

            expect(response.status).toBe(400);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Room is already soft deleted.');
        })

        it('PATCH /rooms/soft-delete/:id - should return 500 on unexpected error', async () => {
            jest.spyOn(mockedRoomSelvice, 'softDelete').mockImplementation(() => {
              throw new Error('Unexpected error');
            });
          
            const response = await request(app.getHttpServer())
              .patch('/rooms/soft-delete/some-invalid-id');
          
            expect(response.status).toBe(500);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.body.message).toBe('Internal server error'); // or your global exception message
          });
    })

    afterEach(async () => {
        await app.close();
    });
})