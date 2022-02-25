import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateBookingDtoRequest } from './create-booking.dto';

export class UpdateBookingDtoRequest  {
    @ApiPropertyOptional()
    @IsOptional()
     room_id:string 
    
    @Type(() => Date)
    @IsDate()
    @ApiPropertyOptional()
    @IsOptional()
     check_in_date : Date;

    @IsDate()
    @Type(()=> Date)
    @ApiPropertyOptional()
    @IsOptional()
     check_out_date : Date; 

     
  
      
}
