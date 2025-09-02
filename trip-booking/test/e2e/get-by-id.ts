/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

export async function GetById_ReturnTRUE(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: string,
    mockedEntity: any,
) {
    jest.spyOn(mockedService, `${methodName}`).mockResolvedValue(mockedEntity);

    const res = await request(app.getHttpServer())
    .get(`${route}${mockedEntity.id}`);
    
    console.log("TRUEresres", res.statusCode, res.status, res.request.url);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedEntity);
}

export async function GetById_ReturnError404(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: string,
    error: any,
) {
    jest.spyOn(mockedService, `${methodName}`).mockImplementation(() => {
         throw error;
    });

    const response = await request(app.getHttpServer())
        .get(`${route}not-existing-id`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`${error.getMessage()}`);
}

export async function GetById_ThrowError500(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: any
) {
    jest.spyOn(mockedService, `${methodName}`).mockImplementation(() => {
        throw new Error('Unexpected error');
    });
    
    const response = await request(app.getHttpServer())
        .get(`${route}some-invalid-id`);
    
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
}