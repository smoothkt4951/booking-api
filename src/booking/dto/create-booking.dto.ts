import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Booking } from "../entities/booking.entity";
import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';





export class CreateBookingDto {
    @ApiPropertyOptional()
    @IsOptional()
    uuid: string;

    @ApiPropertyOptional()
    @IsOptional()
    user_id: string;

    @ApiPropertyOptional()
    @IsOptional()
    room_id: string;

    @ApiPropertyOptional({description: 'Date object in JS, converted to timestampz,usig format ISO8601 for transportation with .toISOString() '})
    @IsOptional()
    check_in_date : string; 
    
    @ApiProperty({description: 'Date object in JS, converted to timestampz,using format ISO8601 for transportation with .toISOString() '})
    @IsOptional()
    check_out_date : string;
  
    @ApiPropertyOptional()
    @IsOptional()
    price: string;
}
