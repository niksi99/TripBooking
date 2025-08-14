/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AppRoutes } from './routes/app.routes';
import { I18nConfigModule } from './i18n/I18nConfigModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    DatabaseModule, UsersModule, AuthModule, AccommodationsModule, RoomsModule, I18nConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: AppRoutes.BasicAcommodationRoute + AppRoutes.GetAllRoute, method: RequestMethod.GET },
        { path: AppRoutes.BasicAcommodationRoute + AppRoutes.GetByIdRoute, method: RequestMethod.GET },
      )
      .forRoutes(AppRoutes.BasicAcommodationRoute);
  }
}
