import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Connection } from 'typeorm'
import { BookingService } from './booking.service'
import { CreateBookingDtoRequest } from './dto/create-booking.dto'
import { UpdateBookingDtoRequest } from './dto/update-booking.dto'
import { BookingEntity } from './entities/booking.entity'

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly connection: Connection,
  ) {}

  @Post('')
  create(
    @Body() createBookingDto: CreateBookingDtoRequest,
  ): Promise<BookingEntity> {
    return this.bookingService.createWithTimesheet(createBookingDto)
  }

  @Get('')
  findAll(): Promise<BookingEntity[]> {
    return this.bookingService.findAll() //done?
  }

  @Get('findByID/:bookingId')
  findBookingByID(
    @Param('bookingId') bookingId: string,
  ): Promise<BookingEntity> {
    return this.bookingService.findBookingByBookingId(bookingId)
  }

  @Get('findByUser/:userId')
  findBookingByUserID(
    @Param('userId') userid: string,
  ): Promise<BookingEntity[]> {
    return this.bookingService.findBookingByUserId(userid)
  }

  @Patch(':bookingId')
  updateById(
    @Param('bookingId') id: string,
    @Body() updateBookingDto: UpdateBookingDtoRequest,
  ): Promise<void> {
    return this.bookingService.updateByBookingId(id, updateBookingDto)
  }

  @Delete(':bookingId')
  remove(@Param('bookingId') id: string): Promise<BookingEntity> {
    return this.bookingService.removeByBookingId(id)
  }
}
