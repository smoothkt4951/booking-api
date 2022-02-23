import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingRepository } from './booking.repository';

@Module({
  imports:[TypeOrmModule.forFeature([BookingRepository])],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
