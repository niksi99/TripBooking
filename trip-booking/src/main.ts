/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AuthExceptionsFilter } from './exceptions-handling/exceptions-filters/auth.exceptions.filter';
import { LoggerService } from './logger/service/LoggerService';
import { LoggerInterceptor } from './logger/interceptor/LoggerInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AuthExceptionsFilter());

  const logger = app.get(LoggerService);

  app.useGlobalInterceptors(new LoggerInterceptor(logger));
  await app.listen(process.env.BACKEND_PORT ?? 1111);
}
bootstrap();
