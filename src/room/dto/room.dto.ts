import { RoomSize } from '../entities/room.entity'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator'
export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'codeName',
  })
  codeName: string
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: RoomSize, description: 'size' })
  size: RoomSize
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'price' })
  price: number
}
export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'codeName',
  })
  codeName: string
  @IsString()
  @IsOptional()
  @ApiProperty({ enum: RoomSize, description: 'size' })
  size: RoomSize
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: 'price' })
  price: number
}

export class RoomResponseDto {
  id: string

  codeName: string

  size: string

  isVacant: boolean

  price: number

  images: string[]
}
export class FileDto {
  originalname: string
  filename: string
  size: string
  path: string
}
export class SearchRoomDto {
  @IsOptional()
  @IsString()
  keyword: string
  @IsOptional()
  page: number
  @IsOptional()
  limit: number
}
