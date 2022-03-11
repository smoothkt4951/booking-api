import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomEntity } from './entity/room.entity'
import { RoomsMiddleware } from './middleware/room.middleware'
import { RequestMethod } from '@nestjs/common/enums/request-method.enum'
import { UserService } from '../user/user.service'

import { UserModule } from 'src/user/user.module'
import { AuthModule } from 'src/auth/auth.module'
import { UserEntity } from 'src/user/user.entity'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([RoomEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, UserService],
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
