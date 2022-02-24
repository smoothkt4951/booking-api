import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateBookingDtoRequest } from './create-booking.dto';

export class UpdateBookingDtoRequest extends PartialType(CreateBookingDtoRequest) {
    @ApiProperty()
    @IsNotEmpty()
    user_id:string

    @ApiProperty()
    @IsNotEmpty()
    room_id:string 
    
    @ApiProperty()
    @IsNotEmpty()
    check_in_date : string;
    
    @ApiProperty()
    @IsNotEmpty()
    check_out_date : string; 
}
