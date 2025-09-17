/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { I18nConfigModule } from './i18n/I18nConfigModule';
import { LocalizationMiddleware } from './middlewares/localization.middleware';
import { ContextModule } from './local-storage-service/local.storage.module';
import { LoggerService } from './logger/service/LoggerService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    DatabaseModule, UsersModule, AuthModule, AccommodationsModule, RoomsModule, I18nConfigModule, ContextModule
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes()
      .apply(LocalizationMiddleware)
      .forRoutes("*");
  }
}
