import { ApiProperty} from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty } from "class-validator";






export class CreateBookingDtoRequest {
    @ApiProperty()
    @IsNotEmpty()
    user_id: string;
    
    @IsNotEmpty()
    @ApiProperty()
    room_id: string;

    @IsNotEmpty()
    @ApiProperty({description: 'Date object in JS, converted to timestampz,usig format ISO8601 '})
    check_in_date : string; 
    
    @IsNotEmpty()
    @ApiProperty({description: 'Date object in JS, converted to timestampz,using format ISO8601 '})
    check_out_date : string;
}
