import { Module } from '@nestjs/common'
import { BookingService } from './booking.service'
import { BookingController } from './booking.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { RoomModule } from 'src/room/room.module'
import { BookingEntity } from './entities/booking.entity'
import { UserEntity } from 'src/user/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    RoomModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
