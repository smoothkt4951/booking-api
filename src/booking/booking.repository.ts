import { ApiProperty } from "@nestjs/swagger";
import moment from "moment";

import { Connection, EntityRepository, LessThan, Repository } from "typeorm";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { Booking } from "./entities/booking.entity";




@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {
    async removeOld(date:Date): Promise<any> {
        var list =await this.find({
         where: { 
             check_out_date:  LessThan(date) },
      });
      for (const entity of list ){
          this.remove(entity)
      }
    }



    addPrice(dto:any){
        try{
            const price =Math.ceil((new Date(dto.check_out_date).getTime()-new Date(dto.check_in_date).getTime())/(3600*24*1000))*dto.price
            dto.totalPrice=price
            return dto
        }
        catch(err){
            return -1
        }
        
    }

    // async CSaddBooking(dto:CreateBookingDto,connection:Connection){
    //     try{
    //         connection.manager.transaction(async entityManager => {
    //             await entityManager.update(Room,dto.roomid,{isVacant:()=>"false"})
    //             const room_entity:Room=await entityManager.findOne(Room,dto.roomid)
    //             const user_entity:UserEntity=await entityManager.findOne(UserEntity,dto.userid)
    //             const entity  = this.create({"Room":room_entity,"User":user_entity})
    //             await entityManager.save(entity)
    //         })
    //     }
    //     catch (err){
    //         console.log(err)
    //     }
    //     return 
    // }

    async create1(dto:CreateBookingDto){
        dto = this.addPrice(dto)
        const entity=this.create({...dto})
        return this.save(entity)
    }
    async updateByBookingId(id: string, dto: UpdateBookingDto) {
        dto = this.addPrice(dto)
        const entity = await this.findOne({booking_id:id})
        return this.update(entity,dto)
     }
}