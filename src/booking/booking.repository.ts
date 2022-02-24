import { ApiProperty } from "@nestjs/swagger";
import moment from "moment";

import { Connection, EntityRepository, LessThan, Repository } from "typeorm";
import { CreateBookingDtoRequest } from "./dto/create-booking.dto";
import { UpdateBookingDtoRequest } from "./dto/update-booking.dto";
import { BookingEntity } from "./entities/booking.entity";




@EntityRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> {
    async removeOld(date:Date): Promise<any> {
        var list =await this.find({
         where: { 
             check_out_date:  LessThan(date) },
      });
      for (const entity of list ){
          this.remove(entity)
      }
    }

    async create1(dto:CreateBookingDtoRequest){
        dto = this.addPrice(dto)
        const entity=this.create({...dto})
        return this.save(entity)
    }
    async updateByBookingId(id: string, dto: UpdateBookingDtoRequest) {
        dto = this.addPrice(dto)
        const entity = await this.findOne({booking_id:id})
        return this.update(entity,dto)
     }





//miscellaneous
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
}