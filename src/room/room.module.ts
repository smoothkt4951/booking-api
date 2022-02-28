import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from './entity/room.entity'
import { RoomsMiddleware } from './middleware/room.middleware'
import { RequestMethod } from '@nestjs/common/enums/request-method.enum'
import { UserService } from '../user/user.service'
import { UserModule } from '../user/user.module'
@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([RoomEntity]),
    UserModule, //https://stackoverflow.com/questions/62579054/nestjs-cant-resolve-dependencies-of-xmodel
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoomsMiddleware)
      .exclude(
        {
          path: 'rooms/pagination',
          method: RequestMethod.GET,
        },
        {
          path: 'rooms/available',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(
        { path: 'rooms/:roomId', method: RequestMethod.GET },
        { path: 'rooms/:roomId', method: RequestMethod.PUT },
        { path: 'rooms/:roomId', method: RequestMethod.DELETE },
      )
  }
}
