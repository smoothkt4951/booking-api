import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("/")
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get("/")
  findAll() {
    return this.bookingService.findAll();//done?
  }

  @Get(':bookingId')
  findBookingByID(@Param('bookingId') id: string) {//not sure, waiting a bit ?
    return this.bookingService.findOne(+id);
  }

  @Get(':userId')
  findBookingByUser(@Param('userId') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':bookingId')
  update(@Param('bookingId') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':bookingId')
  remove(@Param('bookingId') id: number) {
    return this.bookingService.remove(+id);
  }
}
