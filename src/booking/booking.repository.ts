


import { EntityRepository, LessThan, Repository } from "typeorm";
import { CreateBookingDtoRequest } from "./dto/create-booking.dto";
import { UpdateBookingDtoRequest } from "./dto/update-booking.dto";
import { BookingEntity } from "./entities/booking.entity";




@EntityRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> {
    

 


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