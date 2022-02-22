import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Booking } from "../entities/booking.entity";






export class CreateBookingDto extends PartialType(Booking){
    @ApiProperty()
    userID: string;
    
    @ApiProperty()
    roomID: string;

    @ApiProperty()
    check_in_date : string;
  
    @ApiProperty()
    check_out_date : string;
  
    @ApiProperty()
    created_date : string;
}
