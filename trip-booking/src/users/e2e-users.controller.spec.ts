/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { HttpStatus, INestApplication } from "@nestjs/common"
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
import { GetAll_ReturnTRUE, GetAll_ThrowError500 } from "../../test/e2e.get-all-instances";
import { AppRoutes } from "../routes/app.routes";
import { GetById_ReturnError404, GetById_ReturnTRUE, GetById_ThrowError500 } from "../../test/e2e/get-by-id";
import { HardDelete_ReturnError403, HardDelete_ReturnError404, HardDelete_ReturnTRUE, hardDelete_ThrowError500 } from "../../test/e2e/hard-delete";

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
            deletedAt: true,
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
            deletedAt: false
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
            deletedAt: false,
        },
        {
            id: '99a85f64-3536-4562-b3fc-2c963f66afa6',
            firstName: 'ZZZZa',
            lastName: 'ZZZМ',
            username: 'ZZZZZ',
            email: 'zzzzz@gmail.com',
            role: Role.ADMINISTRATOR,
            password: 'ZZZZZZZ',
            accommHistory: [],
            deletedAt: true,
        },
        {
            id: '99a85f67-3536-4562-b3fc-2c963f66afa6',
            firstName: 'Лана',
            lastName: 'Перковић',
            username: 'ЛанаЛана',
            email: 'lana.lana@gmail.com',
            role: Role.ACCOMMODATION_OWNER,
            password: 'ЛанаЛана',
            accommHistory: [],
            deletedAt: false,
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
      }),
      softDelete: jest.fn().mockImplementation((id: string) => {
        const userToDelete = mockedUsers.find(user => user.id === id);
        if (!userToDelete) {
          throw new Error('User does not exist.');
        }
        if (userToDelete.deletedAt === true) {
          throw new Error('User is already soft deleted.');
        }
        userToDelete.deletedAt = true
        return userToDelete;
      }),
      softUndelete: jest.fn().mockImplementation((id: string) => {
        const userToDelete = mockedUsers.find(user => user.id === id);
        if (!userToDelete) {
          throw new Error('User does not exist.');
        }
        if (userToDelete.deletedAt === false) {
          throw new Error('User is not soft deleted, therefore, it can not be undeleted.');
        }
        userToDelete.deletedAt = true
        return userToDelete;
      }),
      create: jest.fn(),
      update: jest.fn(),
      hardDeleteUserAndAllHisAccommodation: jest.fn()
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
        await GetAll_ReturnTRUE(app, AppRoutes.BasicUsersRoute + AppRoutes.GetAllRoute, mockedUsersService, 'findAll', mockedUsers);
      }, 10000)

      it('GET /users - should return error', async () => {
        await GetAll_ThrowError500(app, AppRoutes.BasicUsersRoute + AppRoutes.GetAllRoute, mockedUsersService, 'findAll')
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
          deletedAt: false
        };
        await GetById_ReturnTRUE(app, AppRoutes.BasicUsersRoute, mockedUsersService, 'findOne', user);
      }, 10000);

      it('GET /users/:id - throw UserDoedNotExist', async () => {
          const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
          jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
          jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

          await GetById_ReturnError404(app, AppRoutes.BasicUsersRoute, mockedUsersService, 'findOne', error);
      })

      it('GET /users/:id - should return 500 on unexpected error', async () => {
        await GetById_ThrowError500(app, AppRoutes.BasicUsersRoute, mockedUsersService, 'findOne');
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
          deletedAt: null,
        };

        await HardDelete_ReturnTRUE(app, AppRoutes.BasicUsersRoute + AppRoutes.HardDeleteRoute.split(":")[0], mockedUsersService, 'hardDelete', user);
      });

      it('DELETE /users/hard-delete/:id - throw UserDoesNotExist', async () => {
        const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
        jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

        await HardDelete_ReturnError404(app, AppRoutes.BasicUsersRoute + AppRoutes.HardDeleteRoute.split(":")[0], mockedUsersService, 'hardDelete', error);
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

        const error = new AuthExceptions("", AuthExceptionStatusType.AdministratorCanNotBeDeleted, HttpStatus.FORBIDDEN);
        jest.spyOn(error, 'CanAdministratorBeDeleted').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('Administrator can\'t be deleted!');

        await HardDelete_ReturnError403(app, AppRoutes.BasicUsersRoute + AppRoutes.HardDeleteRoute.split(":")[0], mockedUsersService, 'hardDelete', user, error);
      })

      it('DELETE /users/hard-delete/:id - should return 500 on unexpected error', async () => {
        await hardDelete_ThrowError500(app, AppRoutes.BasicUsersRoute + AppRoutes.HardDeleteRoute.split(":")[0], mockedUsersService, 'hardDelete');
      });
    })

    describe("Soft delete a user", () => {
      it('soft-delede a user - should soft delte it', async () => {
        const user = {
          id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
          firstName: 'Мирко',
          lastName: 'Јанић',
          username: 'МиркоМирко',
          email: 'mirko.mirko@gmail.com',
          role: 'USER',
          password: 'МиркоМирко',
          accommHistory: [],
          deletedAt: false
        };

        jest.spyOn(mockedUsersService, 'softDelete').mockResolvedValue(user);

        const response = await request(app.getHttpServer())
          .patch(`/users/soft-delete/${user.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
      }, 10000);

      it('DELETE /users/soft-delete/:id - throw UserDoesNotExist', async () => {
        const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
        jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

        jest.spyOn(mockedUsersService, 'softDelete').mockImplementation(() => {
            throw error;
        });

        const response = await request(app.getHttpServer())
          .patch('/users/soft-delete/some-invalid-id');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User does not exist.');
      })

      it('DELETE /users/soft-delete/:id - throw User is already soft deleted.', async () => {
        const user = {
          id: '99a85f64-5717-4562-b3fc-2c963f66afa6',
            firstName: 'Ања',
            lastName: 'Милинковић',
            username: 'АњаАњаАња',
            email: 'anjanjaanja@gmail.com',
            role: Role.ADMINISTRATOR,
            password: 'АњаАњаАња',
            accommHistory: [],
            deletedAt: true
        }

        const error = new UsersExceptions("", UsersExceptionStatusType.UserAlreadySoftDeleted);
        jest.spyOn(error, 'IsUserSoftDeleted').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User is already soft deleted.');

        jest.spyOn(mockedUsersService, 'softDelete').mockImplementation(() => {
          throw new AuthExceptions("User is already soft deleted.", AuthExceptionStatusType.AdministratorCanNotBeDeleted, HttpStatus.FORBIDDEN);
        });

        const response = await request(app.getHttpServer())
          .patch(`/users/soft-delete/${user.id}`);


        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is already soft deleted.')
      })

      it('DELETE /users/soft-delete/:id - should return 500 on unexpected error', async () => {
        jest.spyOn(mockedUsersService, 'softDelete').mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      
        const response = await request(app.getHttpServer())
          .patch('/users/soft-delete/some-invalid-id');
      
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
      });
    })

    describe("Soft undelete a user", () => {
      it('soft-undelede a user - should soft undelte it', async () => {
        const user = {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          role: Role.GUIDE,
          password: 'hashedpass',
          accommHistory: [],
          deletedAt: true,
        };

        jest.spyOn(mockedUsersService, 'softUndelete').mockResolvedValue(user);

        const response = await request(app.getHttpServer())
          .patch(`/users/soft-undelete/${user.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
      }, 10000);

      it('DELETE /users/soft-undelete/:id - throw UserDoesNotExist', async () => {
        const error = new UsersExceptions("", UsersExceptionStatusType.UserDoesNotExist);
        jest.spyOn(error, 'IsUserExisting').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User does not exist.');

        jest.spyOn(mockedUsersService, 'softUndelete').mockImplementation(() => {
            throw error;
        });

        const response = await request(app.getHttpServer())
          .patch('/users/soft-undelete/some-invalid-id');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User does not exist.');
      })

      it('DELETE /users/soft-undelete/:id - throw User is already soft deleted.', async () => {
        const user = {
          id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
          firstName: 'Мирко',
          lastName: 'Јанић',
          username: 'МиркоМирко',
          email: 'mirko.mirko@gmail.com',
          role: 'USER',
          password: 'МиркоМирко',
          accommHistory: [],
          deletedAt: false
        };

        const error = new UsersExceptions("", UsersExceptionStatusType.UserIsNotSoftUndeleted);
        jest.spyOn(error, 'IsNotUserSoftDeleted').mockReturnValue(true);
        jest.spyOn(error, 'getMessage').mockReturnValue('User is not soft deleted, therefore, it can not be undeleted.');

        jest.spyOn(mockedUsersService, 'softUndelete').mockImplementation(() => {
          throw new AuthExceptions("User is not soft deleted, therefore, it can not be undeleted.", AuthExceptionStatusType.AdministratorCanNotBeDeleted, HttpStatus.FORBIDDEN);
        });

        const response = await request(app.getHttpServer())
          .patch(`/users/soft-undelete/${user.id}`);


        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is not soft deleted, therefore, it can not be undeleted.')
      })

      it('DELETE /users/soft-undelete/:id - should return 500 on unexpected error', async () => {
        jest.spyOn(mockedUsersService, 'softUndelete').mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      
        const response = await request(app.getHttpServer())
          .patch('/users/soft-undelete/some-invalid-id')
      
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
      });
    })

    describe("Create a user", () => {
      const newUser = {
        id: '22a85f64-5717-4562-b3fc-2c963f66afa6',
        firstName: 'Јовица',
        lastName: 'Милинковић',
        username: 'Јојо222222',
        email: 'jojojojo@gmail.com',
        role: Role.ADMINISTRATOR,
        password: 'Јојо222222',
        accommHistory: [],
        deletedAt: false,
      }

      it("Should return created user", async () => {
        jest.spyOn(mockedUsersService, 'create').mockImplementation((user: any) => {
          const emailExists = mockedUsers.some(u => u.email === user.email);
          if (emailExists) {
            throw new UsersExceptions("Email already exists", UsersExceptionStatusType.EmailAlreadyExists);
          }
          
          const usernameExists = mockedUsers.some(u => u.email === user.username);
          if (usernameExists) {
            throw new UsersExceptions("Username already exists", UsersExceptionStatusType.UserAlreadyExists);
          }

          mockedUsers.push(user);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return user;
        });
        
        const response = await request(app.getHttpServer())
          .post(`/users/create`)
          .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newUser);
      })

      it('POST /users - throw EmailAlreadyExists.', async () => {
        jest.spyOn(mockedUsersService, 'create').mockImplementation(() => {
          const emailExists = mockedUsers.some(u => u.email === newUser.email);
          if (emailExists) {
            throw new UsersExceptions("Email already exists", UsersExceptionStatusType.EmailAlreadyExists);
        }
          return newUser;
        });

        const response = await request(app.getHttpServer())
          .post('/users/create')
          .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email already exists");
      })

      it('POST /users - throw UsernameAlreadyExists', async () => {
        jest.spyOn(mockedUsersService, 'create').mockImplementation(() => {
          const usernameExists = mockedUsers.some(u => u.username === newUser.username);
          if (usernameExists) {
            throw new UsersExceptions("Username already exists", UsersExceptionStatusType.UsernameAlreadyExists);
          }
          return newUser;
        });

        const response = await request(app.getHttpServer())
          .post('/users/create')
          .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Username already exists");
      })

      it("POST /uers  should return 500 or unexpected error", async () => {
          jest.spyOn(mockedUsersService, "create").mockImplementation(() => {
              throw new Error('Unexpected error');
          })

          const response = await request(app.getHttpServer())
              .post(`/users/create`);
          
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Internal server error'); // or your global exception message
      })
    })

    describe("Update a user", () => {
      const updatedUser = {
        id: '4ya85f64-5717-4562-b3fc-2c963f66afa6',
        firstName: 'Мирко',
        lastName: 'Јанић',
        username: 'МиркоМирко',
        email: 'mirko.mirko@gmail.com',
        role: Role.PASSENGER,
        password: 'МиркоМирко',
        accommHistory: [],
        deletedAt: false
      }

      const updatedUserWrongId = {
        id: '411ya85f64-5717-4562-b3fc-2c963f66afa6',
        firstName: 'Мирко',
        lastName: 'Јанић',
      }

      const updatedUserSoftDeleted = {
        id: '99a85f64-3536-4562-b3fc-2c963f66afa6',
        deletedAt: true
      }

      it("PATCH Should return updated user", async () => {
        jest.spyOn(mockedUsersService, 'update').mockImplementation(() => {
          const index = mockedUsers.findIndex(u => u.id === updatedUser.id);
          if (index === -1) {
            throw new UsersExceptions("User does not exist", UsersExceptionStatusType.UserDoesNotExist);
          }

          if (mockedUsers[index].deletedAt === true) {
            throw new UsersExceptions("User is soft deleted, can not be updated.", UsersExceptionStatusType.UserAlreadySoftDeleted);
          }
          
          mockedUsers[index] = updatedUser;
          return updatedUser;
        });
        
        const response = await request(app.getHttpServer())
          .patch(`/users/${updatedUser.id}`)
          .send(updatedUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
      })

      it('PATCH /users - throw User does not exist', async () => {
        jest.spyOn(mockedUsersService, 'update').mockImplementation(() => {
          const index = mockedUsers.findIndex(u => u.id === updatedUserWrongId.id);
          if (index === -1) {
            throw new UsersExceptions("User does not exist", UsersExceptionStatusType.UserDoesNotExist);
          }
          return index;
        });

        const response = await request(app.getHttpServer())
          .patch(`/users/-1`)
          .send(updatedUserWrongId);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User does not exist");
      })

      it('PATCH /users - throw User is soft-deleted.', async () => {
        jest.spyOn(mockedUsersService, 'update').mockImplementation(() => {
          const userExists = mockedUsers.find(u => u.id === updatedUserSoftDeleted.id);
          if (userExists?.deletedAt === true) {
            throw new UsersExceptions("User is soft deleted, can not be updated.", UsersExceptionStatusType.UserAlreadySoftDeleted);
        }
          return userExists;
        });

        const response = await request(app.getHttpServer())
          .patch(`/users/${updatedUserSoftDeleted.id}`)
          .send(updatedUserSoftDeleted);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("User is soft deleted, can not be updated.");
      })

      it("POST /uers  should return 500 or unexpected error", async () => {
          jest.spyOn(mockedUsersService, "update").mockImplementation(() => {
              throw new Error('Unexpected error');
          })

          const response = await request(app.getHttpServer())
              .patch(`/users/some-invlaid-id`);
          
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Internal server error'); // or your global exception message
      })
    });
})