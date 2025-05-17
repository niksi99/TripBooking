/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "./users.module";
import { User } from "./entities/user.entity";
import * as request from 'supertest';
import { DataSource, Repository } from "typeorm";
import { UserRepository } from "src/repositories/UserRepository";

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

    const mockedUserRepository: Partial<Repository<User>> = {
        find: jest.fn().mockReturnValue(mockedUsers),
        findOne: jest.fn()
    };// as unknown as Repository<User>;

    const mockedDataSource: Partial<DataSource> = {
        getRepository: jest.fn().mockReturnValue(mockedUserRepository),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        transaction: jest.fn().mockImplementation(async (cb) => await cb({})),
      };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [UsersModule],
        })
          .overrideProvider(DataSource)
          .useValue(mockedDataSource)
          .overrideProvider(UserRepository)
          .useFactory({
            factory: () =>
              new UserRepository(mockedDataSource as DataSource, mockedUserRepository as Repository<User>),
          })
          .compile();
    
        app = moduleFixture.createNestApplication();
        await app.init();
      });
    
      afterEach(async () => {
        await app.close();
      });
    
    it('/users/get-all (GET)', async () => {
        const res = await request(app.getHttpServer()).get('/users/get-all');
        console.log("TEST-BODY", res.body);

        expect(res.status).toBe(200);
    })

    describe('/users/:id (GET)', () => {
        it('return valid user according to send id', async() => {
            const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'; // You need to use an actual ID that exists in your DB

            (mockedUserRepository.findOne as jest.Mock).mockImplementation((id: string) => {
                return mockedUsers.find(user => user.id === id); 
            });

            const result = await request(app.getHttpServer()).get(`/users/${userId}`);
            console.log("TEST-BODY", result.body);

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('id', userId);   
        })   
    })
})