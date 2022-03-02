import { Module } from '@nestjs/common'
import { BookingService } from './booking.service'
import { BookingController } from './booking.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { RoomModule } from 'src/room/room.module'
import { BookingEntity } from './entities/booking.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), UserModule, RoomModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
