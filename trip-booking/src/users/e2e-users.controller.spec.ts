/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth/jwt-auth.guard";
import { MockJwtAuthGuard, MockRolesGuard } from "../auth/guards/mocked/mocked-auth.guards";
import { RolesGuard } from "src/auth/guards/roles/roles.guard";
import { UsersExceptions } from "src/exceptions-handling/exceptions/users.exceptions";
import { UsersExceptionStatusType } from "src/exceptions-handling/exceptions-status-type/user.exceptions.status.type";
import { AuthExceptions } from "src/exceptions-handling/exceptions/auth.exceptions";
import { AuthExceptionStatusType } from "src/exceptions-handling/exceptions-status-type/auth.exceptions.status.types";
import { Role } from "src/auth/enums/role.enum";

jest.setTimeout(15000);
describe('UsersController (e2e)', () => {
    let app: INestApplication;
    const mockedUsers = [
        {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'john@example.com',
            role: Role.GUIDE,
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
            role: Role.PASSENGER,
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
            role: Role.ADMINISTRATOR,
            password: 'АњаАњаАња',
            accommHistory: [],
            softDeleted: true
        }
    ];

    const mockedUsersService= {
        findAll: jest.fn().mockReturnValue(mockedUsers),
        findOne: jest.fn().mockImplementation((id: string) => {
          return mockedUsers.find(user => user.id === id);
        }),
        hardDelete: jest.fn().mockImplementation((id: string) => {
          const userToDelete = mockedUsers.find(user => user.id === id);
          if (!userToDelete) {
            throw new Error('User does not exist.');
          }
          if (userToDelete.role === Role.ADMINISTRATOR) {
            throw new Error('Administrator can\'t be deleted!');
          }
          return mockedUsers.filter(user => user.id !== id);
        })
    };


    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
          controllers: [UsersController],
          providers: [
            {
              provide: UsersService,
              useValue: mockedUsersService,
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
    
    afterEach(async () => {
      await app.close();
    });
    
    describe("GET /users", () => {
      it('/users/get-all (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/users/get-all');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockedUsers);
      }, 10000)

      it('GET /users - should return error', async () => {
        jest.spyOn(mockedUsersService, 'findAll').mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      
        const response = await request(app.getHttpServer())
          .get('/users/get-all ');
      
        expect(response.status).toBe(500);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe('Internal server error');
      }, 10000);
    })

    describe("GET a user by id", () => {
      it('GET /users - should return a user', async () => {
        const user = {
          id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
          firstName: 'Мирко',
          lastName: 'Јанић',
          username: 'МиркоМирко',
          email: 'mirko.mirko@gmail.com',
          role: 'USER',
          password: 'МиркоМирко',
          accommHistory: [],
          softDeleted: false
        };

        jest.spyOn(mockedUsersService, 'findOne').mockResolvedValue(user);

        const response = await request(app.getHttpServer())
          .get(`/users/${user.id}`);
  
          expect(response.status).toBe(200);
          expect(response.body).toEqual(user);
      }, 10000);

      it('GET /users/:id - throw UserDoedNotExist', async () => {
          const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
          jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
          jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

          jest.spyOn(mockedUsersService, 'findOne').mockImplementation(() => {
              throw error;
          });

          const response = await request(app.getHttpServer())
              .get('/users/some-invalid-id');

          expect(response.status).toBe(404);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(response.body.message).toBe('User does not exist.');
      })

      it('GET /rooms/:id - should return 500 on unexpected error', async () => {
          jest.spyOn(mockedUsersService, 'findOne').mockImplementation(() => {
            throw new Error('Unexpected error');
          });
        
          const response = await request(app.getHttpServer())
            .get('/users/some-invalid-id');
        
          expect(response.status).toBe(500);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(response.body.message).toBe('Internal server error');
      });
    })

    describe("Hard delete a user", () => {
      it('hard-delede a user - should hard delte it', async () => {
        const user = {
          id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
          firstName: 'Мирко',
          lastName: 'Јанић',
          username: 'МиркоМирко',
          email: 'mirko.mirko@gmail.com',
          role: 'USER',
          password: 'МиркоМирко',
          accommHistory: [],
          softDeleted: false
        };

        jest.spyOn(mockedUsersService, 'hardDelete').mockResolvedValue(user);

        const response = await request(app.getHttpServer())
          .delete(`/users/hard-delete/${user.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
      }, 10000);

      it('DELETE /users/hard-delete/:id - throw UserDoesNotExist', async () => {
        const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
        jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

        jest.spyOn(mockedUsersService, 'hardDelete').mockImplementation(() => {
            throw error;
        });

        const response = await request(app.getHttpServer())
          .delete('/users/hard-delete/some-invalid-id');

        expect(response.status).toBe(404);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe('User does not exist.');
      })

      it('DELETE /users/hard-delete/:id - throw AdminCanNotBeDeleted', async () => {
        const user = {
          id: '99a85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'Ања',
            lastName: 'Милинковић',
            username: 'АњаАњаАња',
            email: 'anjanjaanja@gmail.com',
            role: Role.ADMINISTRATOR,
            password: 'АњаАњаАња',
            accommHistory: [],
            softDeleted: true
        }

        const error = new AuthExceptions("", AuthExceptionStatusType.AdministratorCanNotBeDeleted);
        jest.spyOn(error, 'CanAdministratorBeDeleted').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('Administrator can\'t be deleted!');

        jest.spyOn(mockedUsersService, 'hardDelete').mockImplementation(() => {
          throw new AuthExceptions("", AuthExceptionStatusType.AdministratorCanNotBeDeleted);
        });

        const response = await request(app.getHttpServer())
          .delete(`/users/hard-delete/${user.id}`);


        expect(response.status).toBe(404);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe('Administrator can\'t be deleted!')
      })

      it('DELETE /users/hard-delete/:id - should return 500 on unexpected error', async () => {
        jest.spyOn(mockedUsersService, 'hardDelete').mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      
        const response = await request(app.getHttpServer())
          .delete('/users/hard-delete/some-invalid-id');
      
        expect(response.status).toBe(500);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe('Internal server error');
      });
    })
})