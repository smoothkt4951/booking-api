import { Injectable, NotFoundException, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingRepository } from './booking.repository';
import { CreateBookingDtoRequest } from './dto/create-booking.dto';
import { UpdateBookingDtoRequest } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private repository:BookingRepository,
    // private userService:UserService,
    // private roomService:RoomService

    ){}
  async create(dto: CreateBookingDtoRequest) {
    return await this.repository.create1(dto)
  }

  async findAll() {
    const entity_list = await this.repository.find() 
    return entity_list
  }

  async findBookingByBookingId(id: string) { //uuid
    try{
      const entity = await this.repository.findOneOrFail({booking_id:id})
      return entity;
    }
    catch (err) {
        throw err
    }
  }

  async findBookingByUserId(id: string) {      
    const  entity_list = await this.repository.find({user_id:id}) 
    console.log(!entity_list)
    if (entity_list.length==0)
      throw new NotFoundException("not found")
    return entity_list
  }

  async updateByBookingId(Bookingid: string, dto: UpdateBookingDtoRequest) { 

    return await this.repository.updateByBookingId(Bookingid ,dto)
  }

  async removeByBookingId(booking_id: string) {
    const entity = await this.findBookingByBookingId(booking_id)
    return this.repository.remove(entity);
  }

  async removeOldEntries() {
    const date = new Date()
    return this.repository.removeOld(date)
  }
}


