import { ApiProperty } from "@nestjs/swagger";
import { Connection, EntityRepository, Repository } from "typeorm";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { Booking } from "./entities/booking.entity";




@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {
    async CSaddBooking(dto:CreateBookingDto,connection:Connection){
        try{
            connection.manager.transaction(async entityManager => {
                await entityManager.update(Room,dto.roomid,{isVacant:()=>"false"})
                const room_entity:Room=await entityManager.findOne(Room,dto.roomid)
                const user_entity:UserEntity=await entityManager.findOne(UserEntity,dto.userid)
                const entity  = this.create({"Room":room_entity,"User":user_entity})
                await entityManager.save(entity)
            })
        }
        catch (err){
            console.log(err)
        }
        return 
    }
}