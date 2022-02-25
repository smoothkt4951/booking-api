import { HttpException, HttpStatus, Injectable, NotFoundException, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { BookingRepository } from './booking.repository';
import { CreateBookingDtoRequest } from './dto/create-booking.dto';
import { UpdateBookingDtoRequest } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private repository:BookingRepository,
    private userService:UserService,
    private roomService:RoomService
    ){}
  async create(dto: CreateBookingDtoRequest,connection:Connection) {
    const room_entity:RoomEntity=await this.roomService.findOne(dto.room_id)
    const user_entity:UserEntity=await this.userService.findUserBy({id:dto.user_id});
    if (room_entity.isVacant){
      try{
        return await connection.manager.transaction(async entityManager => { 
          const price =Math.ceil((new Date(dto.check_out_date).getTime()-new Date(dto.check_in_date).getTime())/(3600*24*1000))*room_entity.price
          await entityManager.update(RoomEntity,room_entity,{isVacant:false})
          const entity  = this.repository.create({"Room":room_entity,"User":user_entity,"check_in_date":dto.check_in_date,"check_out_date":dto.check_out_date,"totalPrice":price})
          return entityManager.save(entity)
        })
      }
      catch(err){
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }     
    }
    else throw new HttpException(
      {
        message: "Room is already booked for this time interval"
      },
      HttpStatus.GONE
    );
}

  async findAll() {
    const entity_list = await this.repository.find().catch((err)=>{
        throw new HttpException(
          {
            message: err.message
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      })
    return entity_list
  }

  async findBookingByBookingId(id: string) { //uuid
    const entity = await this.repository.findOneOrFail({booking_id:id}).catch((err) =>{
      throw new HttpException(
        {
          message: err.message
        },
        HttpStatus.BAD_REQUEST,
      );
    })
    return entity;
    
    
  }

  async findBookingByUserId(id: string) {
    const  user_entity:UserEntity =await this.userService.findUserBy({id:id})
    if (!user_entity){
      throw new NotFoundException("User with not found")
    }      
    const  entity_list = await this.repository.find({UserID:user_entity.id}).catch((err) =>{
      throw new HttpException(
        {
          message: err.message
        },
        HttpStatus.BAD_REQUEST,
      );
    })
    
    return entity_list
  }

  async updateByBookingId(Bookingid: string, dto: UpdateBookingDtoRequest) { 

    return await this.repository.updateByBookingId(Bookingid ,dto)
  }

  async removeByBookingId(booking_id: string) {
    const entity = await this.findBookingByBookingId(booking_id)
    if (!entity){
      throw new NotFoundException("Booking is not found")
    }
    return this.repository.remove(entity).catch((err) =>{
      throw new HttpException(
        {
          message: err.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async removeOldEntries() {
    const date = new Date()
    return this.repository.removeOld(date)
  }
}


