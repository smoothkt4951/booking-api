import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateBookingDtoRequest } from './create-booking.dto';

export class UpdateBookingDtoRequest extends PartialType(CreateBookingDtoRequest) {
    @ApiPropertyOptional()
    @IsOptional()
    room_id:string 
    
    @ApiPropertyOptional()
    @IsOptional()
    check_in_date : string;
    
    @ApiPropertyOptional()
    @IsOptional()
    check_out_date : string; 
}
