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

  @Delete('/justright/')
  scheduled(){
    return this.bookingService.removeOldEntries()
  }

  @Get(':bookingId')
  findBookingByID(@Param('bookingId') bookingId: string) {
    return this.bookingService.findBookingByBookingId(bookingId);
  }

  @Get(':userId')
  findBookingByUserID(@Param('userId') userid: string) {
    return this.bookingService.findBookingByUserId(userid);
  }

  @Patch(':bookingId')
  updateById(@Param('bookingId') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.updateByBookingId(id, updateBookingDto);
  }

  @Delete(':bookingId')
  remove(@Param('bookingId') id: string) {
    return this.bookingService.removeByBookingId(id);
  }


}
