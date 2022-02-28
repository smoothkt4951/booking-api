<<<<<<< HEAD
import { IsNotEmpty, IsEnum, IsDate, MaxDate } from 'class-validator'
import { Gender } from 'src/user/user.entity'
=======
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsDate, MaxDate } from 'class-validator';
import { Gender } from 'src/user/user.entity';
>>>>>>> origin/merging

export class UpdateUserInfoDto {
  @IsNotEmpty()
  firstname: string

  @IsNotEmpty()
  lastname: string

  @IsEnum(['male', 'female', 'other'])
  @IsNotEmpty()
  gender: Gender

  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  dayOfBirth: string
}
