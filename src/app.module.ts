import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { RedisMiddleware } from './auth/middlewares/redis.middleware';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // isGlobal property to true so this module is loaded on every other module (if you don’t set this, you’ll have to add the ConfigModule to the imports of every module where you have to use the .env information).
    }),
    AuthModule,
    BookingModule,
    UserModule,
    RoomModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db_local',
      port: 5432 || +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST || 'my_redis',
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    CloudinaryService,
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    consumer
      .apply(RedisMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/logout',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
