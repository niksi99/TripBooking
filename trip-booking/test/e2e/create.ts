/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

export async function Create_ThrowError500(
    app: INestApplication<App>,
    route: string,
    mockedService: any,
    methodName: any
) {
    jest.spyOn(mockedService, `${methodName}`).mockImplementation(() => {
        throw new Error('Unexpected error');
    });
    
    const response = await request(app.getHttpServer())
        .post(`${route}`);
    
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
}