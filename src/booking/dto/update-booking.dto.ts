import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    id : string;

    booking_id:string

    user_id:string

    room_id:string 

    check_in_date : string;

    check_out_date : string;

    created_date : string;

    totalPrice :number 
}
