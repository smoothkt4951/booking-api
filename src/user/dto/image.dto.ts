import { IsString, IsNotEmpty } from 'class-validator';

export class ImageDto {
  originalname: string;
  filename: string;
  size: string;
  path: string;
}
