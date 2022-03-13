import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsDate, MaxDate } from 'class-validator';
import { Gender } from 'src/user/entities/user.entity';

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'firstname'
  })
  firstname: string

  @IsNotEmpty()
  @ApiProperty({description: 'lastname'})
  lastname: string

  @IsEnum(['male', 'female', 'other'])
  @IsNotEmpty()
  @ApiProperty({enum: Gender, description:' gender'}, )
  gender: Gender

  @MaxDate(new Date())
  @Type(() => Date)
  @IsDate()
  @ApiProperty({description: 'date of birth'})
  dateOfBirth: string
}
