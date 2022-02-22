import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule],
=======
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
>>>>>>> 73679577c6ffcb63eeb413ccf6d8c7e1fc95d96b
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
