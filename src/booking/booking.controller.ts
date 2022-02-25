import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { Connection } from 'typeorm';
import { BookingService } from './booking.service';
import { CreateBookingDtoRequest } from './dto/create-booking.dto';
import { UpdateBookingDtoRequest } from './dto/update-booking.dto';

@Controller('/booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly connection:Connection
    ) {}

  @Post("/")
  create(@Body() createBookingDto: CreateBookingDtoRequest) {
    return this.bookingService.create(createBookingDto,this.connection);
  }

  @Get("/")
  findAll() {
    return this.bookingService.findAll();//done?
  }

  @Get('/findByID/:bookingId')
  findBookingByID(@Param('bookingId') bookingId: string) {
    return this.bookingService.findBookingByBookingId(bookingId);
  }

  @Get('/findByUser/:userId')
  findBookingByUserID(@Param('userId') userid: string) {
    return this.bookingService.findBookingByUserId(userid);
  }

  @Patch(':bookingId')
  updateById(@Param('bookingId') id: string, @Body() updateBookingDto: UpdateBookingDtoRequest) {
    return this.bookingService.updateByBookingId(id, updateBookingDto);
  }

  @Delete(':bookingId')
  remove(@Param('bookingId') id: string) {
    return this.bookingService.removeByBookingId(id);
  }
  @Delete('intervalDelete')  //admin related duty, should be transferred to controller Admin

  intervalRemove(){
    return this.bookingService.removeOldEntries()
  }
}
