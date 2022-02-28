import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, isNotEmpty } from 'class-validator'

export class CreateBookingDtoRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly user_id: string

  @IsNotEmpty()
  @ApiProperty()
  readonly room_id: string

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Date object in JS, converted to timestampz,usig format ISO8601 ',
  })
  readonly check_in_date: Date

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Date object in JS, converted to timestampz,using format ISO8601 ',
  })
  readonly check_out_date: Date
}
