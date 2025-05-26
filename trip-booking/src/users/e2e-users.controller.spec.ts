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

    const mockedUsersService= {
        findAll: jest.fn().mockReturnValue(mockedUsers),
        findOne: jest.fn().mockImplementation((id: string) => {
          return mockedUsers.find(x => x.id === id);
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

      it('GET /rooms - should return error', async () => {
        jest.spyOn(mockedUsersService, 'findAll').mockImplementation(() => {
          throw new Error('Unexpected error');
        });
      
        const response = await request(app.getHttpServer())
          .get('/users/get-all');
      
        expect(response.status).toBe(500);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe('Internal server error');
      }, 10000);
    })
})