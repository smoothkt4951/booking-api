import { HttpException, HttpStatus, Injectable, NotFoundException, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { stringify } from 'querystring';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, LessThan, Repository } from 'typeorm';
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
 priceCalculation(entity:RoomEntity,dto){
    return Math.ceil((new Date(dto.check_out_date).getTime()-new Date(dto.check_in_date).getTime())/(3600*24*1000))*entity.price
 }
  


  
  async createWithTimesheet(dto: CreateBookingDtoRequest,connection:Connection){
    const room_entity:RoomEntity=await this.roomService.findOne(dto.room_id)
    const user_entity:UserEntity=await this.userService.findUserBy({id:dto.user_id});
    let timesheet= await this.getRoomTimesheet(room_entity.id)
    const res = await this.checkTimesheetInsertion(timesheet,dto.check_in_date,dto.check_out_date)
    if (res){
      const entity  = this.repository.create({"Room":room_entity,"User":user_entity,...dto,"totalPrice":this.priceCalculation(room_entity,dto)})
      console.log(entity)
      return this.repository.save(entity)
    }
    else throw new HttpException(
      {
        message: "Room is already booked for this time interval ",
      },
      HttpStatus.GONE,
    ); 
  }



  async create(dto: CreateBookingDtoRequest,connection:Connection) {
    const room_entity:RoomEntity=await this.roomService.findOne(dto.room_id)
    const user_entity:UserEntity=await this.userService.findUserBy({id:dto.user_id});
    if (room_entity.isVacant){
      try{
        return await connection.manager.transaction(async entityManager => { 
          await entityManager.update(RoomEntity,room_entity,{isVacant:false})
          const entity  = this.repository.create({"Room":room_entity,"User":user_entity,...dto,"totalPrice":this.priceCalculation(room_entity,dto)})
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
    const  entity_list = await this.repository.find({UserID:id}).catch((err) =>{
      throw new HttpException(
        {
          message: err.message
        },
        HttpStatus.BAD_REQUEST,
      );
    })
    
    return entity_list
  }

  async findBookingByRoomId(id: string) {   
    const  entity_list = await this.repository.find({RoomID:id}).catch((err) =>{
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
    if (!Object.keys(dto).length){
      throw new HttpException(
        {
          message: "No body found"
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const booking_entity = await this.findBookingByBookingId(Bookingid)
    let dummydto= JSON.parse(JSON.stringify(dto)) 
    for (var field in dto){
      if(!dto[field]){dummydto[field]=booking_entity[field]}
    }
    
    let  target_room_entity = await this.roomService.findOne(dto.room_id)
    let target_timesheet:Array<Date>
    if (!target_room_entity){//không dổi phòng 
      target_room_entity=await this.roomService.findOne(dummydto.RoomID)
      target_timesheet= await this.getRoomTimesheet(target_room_entity.id)
      target_timesheet=target_timesheet.filter(date => (date!== dummydto.check_in_date)||(date!== dummydto.check_out_date))
    }
    else {target_timesheet = await this.getRoomTimesheet(target_room_entity.id)}
    
    if (await this.checkTimesheetInsertion(target_timesheet,dummydto.check_in_date,dummydto.check_out_date)){
       await this.repository.update(booking_entity,{...dummydto,totalPrice:this.priceCalculation(target_room_entity,dummydto)})
    }
    else throw  new HttpException(
      {
        message: "Room is already booked for this time interval"
      },
      HttpStatus.GONE,
    );
  }

  async removeByBookingId(booking_id: string) {
    const entity = await this.findBookingByBookingId(booking_id)
    if (!entity){
      throw new NotFoundException("Booking not found")
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
    var list =await this.repository.find({
      where: { 
          check_out_date:LessThan(date)
        },
      });
    for (const entity of list){
        await this.repository.remove(entity) 
    }
  }

  async getRoomTimesheet(room_id:string):Promise<Date[]>{
    const target_booking_list= await this.findBookingByRoomId(room_id)
    let timesheet =[]
    target_booking_list.map(entity => {timesheet.push(entity["check_in_date"],entity["check_out_date"]);return timesheet})
    return timesheet
  }

  async checkTimesheetInsertion(timesheet:Array<Date>,chIn:Date,chOut:Date){
    timesheet.push(chIn,chOut)
    timesheet.sort()
    const diff = timesheet.indexOf(chIn)-timesheet.indexOf(chOut)
    if (diff == -1 && timesheet.indexOf(chIn)%2==0){
        return true
    }
    else return false
  }
}


