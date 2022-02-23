import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { RoomsMiddleware } from './middleware/room.middleware';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([RoomEntity]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RoomsMiddleware).forRoutes(
      // { path: 'api/rooms/:roomId', method: RequestMethod.GET },
      { path: 'api/rooms/:roomId', method: RequestMethod.PUT },
      { path: 'api/rooms/:roomId', method: RequestMethod.DELETE },
    );
  }
}
