import { RoomSize } from '../entity/room.entity';
import {
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
  @IsNumber()
  @Min(1)
  page: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;
}
