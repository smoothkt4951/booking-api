import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Booking } from "../entities/booking.entity";
import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';





export class CreateBookingDtoRequest {
    @ApiProperty()
    user_id: string;

    @ApiProperty()
    room_id: string;

    @ApiProperty({description: 'Date object in JS, converted to timestampz,usig format ISO8601 '})
    check_in_date : string; 
    
    @ApiProperty({description: 'Date object in JS, converted to timestampz,using format ISO8601 '})
    check_out_date : string;
}
