import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Booking } from "../entities/booking.entity";
import { IsDate, IsEmail, isNotEmpty, IsNotEmpty } from 'class-validator';





export class CreateBookingDto {
    @ApiProperty()
    @IsNotEmpty()
    userid: string;

    @IsNotEmpty()
    @ApiProperty()
    roomid: string;

    @ApiProperty({description: 'Date object in JS, converted to timestampz for transportation with .toISOString() '})
    check_in_date : string; 
  
    @ApiProperty({description: 'Date object in JS, converted to timestampz for transportation with .toISOString() '})
    check_out_date : string;
  

    @ApiProperty()
    totalPrice: number;
}
