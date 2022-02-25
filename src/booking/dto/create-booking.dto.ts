import { ApiProperty} from "@nestjs/swagger";






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
