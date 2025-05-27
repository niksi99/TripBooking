/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';


export async function GetAll_ReturnTRUE(
    app: INestApplication<App>,
    route: string,
    mockedEntities: any
) {
    const res = await request(app.getHttpServer())
        .get(`${route}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedEntities);
}