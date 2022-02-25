import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { BookingRepository } from './booking.repository';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports:[TypeOrmModule.forFeature([BookingRepository]),UserModule,RoomModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
