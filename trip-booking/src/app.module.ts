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
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AppRoutes } from './routes/app.routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    DatabaseModule, UsersModule, AuthModule, AccommodationsModule, RoomsModule,
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true
        },
        typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts')
      }),
      resolvers: [new HeaderResolver(['x-custom-lang'])]
    })
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
      )
      .forRoutes(AppRoutes.BasicAcommodationRoute);
  }
}
