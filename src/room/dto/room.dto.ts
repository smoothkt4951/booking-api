import { RoomSize } from '../entity/room.entity'
import {
<<<<<<< HEAD
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator'
export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  codeName: string
  @IsNotEmpty()
  @IsString()
  size: RoomSize
  @IsNotEmpty()
  @IsNumber()
  price: number
}
export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  codeName: string
  @IsString()
  @IsOptional()
  size: RoomSize
  @IsNumber()
  @IsOptional()
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
  @IsString()
  sort: string
  @IsOptional()
  page: number
  @IsOptional()
  limit: number
=======
    IsNotEmpty,
    IsNumber,
    IsString,
    IsOptional,
    Min,
} from 'class-validator';
export class CreateRoomDto {
    @IsNotEmpty()
    @IsString()
    codeName: string;
    @IsNotEmpty()
    @IsString()
    size: RoomSize;
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
export class UpdateRoomDto {
    @IsString()
    @IsOptional()
    codeName: string;
    @IsString()
    @IsOptional()
    size: RoomSize;
    @IsNumber()
    @IsOptional()
    price: number;
}

export class RoomResponseDto {
    id: string;

    codeName: string;

    size: string;

    isVacant: boolean;

    price: number;

    images: string[];
}
export class FileDto {
    originalname: string;
    filename: string;
    size: string;
    path: string;
}
export class SearchRoomDto {
    @IsOptional()
    @IsString()
    keyword: string;
    @IsOptional()
    @IsString()
    sort: string;
    @IsOptional()
    page: number;
    @IsOptional()
    limit: number;
>>>>>>> 37bf5fece5b5f7f540f8626b88fc5959daa6891c
}
