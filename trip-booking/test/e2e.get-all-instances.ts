/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';


export async function GetAll_ReturnTRUE(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: string,
    mockedEntities: any,
) {
    jest.spyOn(mockedService, `${methodName}`).mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return mockedEntities;
    });

    const res = await request(app.getHttpServer())
        .get(route);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockedEntities);
}

export async function GetAll_ThrowError500(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: any
) {
    jest.spyOn(mockedService, `${methodName}`).mockImplementation(() => {
        throw new Error('Unexpected error');
    });
    
    const response = await request(app.getHttpServer())
        .get(`${route}`);
    
    expect(response.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBe('Internal server error');
}