import { Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private repository:BookingRepository,
    // private userService:UserService,
    // private roomService:RoomService
    private userArray=[],
    private roomArray=[],
    ){}
    
  async create(createBookingDto: CreateBookingDto) {// TRANSACTION REQUIRED and all of these are to be in the independent repository
    // var room_entity:Room=await this.roomService.findOne(parseInt(createBookingDto.roomid))
    // var user_entity:User=await this.userService.findOne(parseInt(createBookingDto.userid))
    // var check_in_date:Date=new Date(createBookingDto.check_in_date)
    // var check_out_date:Date=new Date(createBookingDto.check_out_date)
    // var created_at:Date = new Date(createBookingDto.created_date)
    
    // room_entity.isVacant=false;                     // Must change to alternative .merge()                                                
    // var entity  = this.repository.create({"room_id":room_entity,"user_id":user_entity,"check_in_date":check_in_date,"check_out_date":check_out_date,"created_at":created_at})
    // return this.repository.save(entity)
  }

  async findAll() {
    var entity_list = await this.repository.find()
    return entity_list
  }

  async findOne(id: number) { //uuid
    return await this.repository.findOneOrFail(id)
  }

  update(id: number, updateBookingDto: UpdateBookingDto) { //this one fking wait 
    return `This action updates a #${id} booking`;
  }

  async remove(id: number) {
    var entity = await this.repository.findOneOrFail(id)
    return this.repository.remove(entity);
  }
}


