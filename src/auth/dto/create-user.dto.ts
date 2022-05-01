import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'firstname' })
  firstname: string

  @IsNotEmpty()
  @ApiProperty({ description: 'lastname' })
  lastname: string

  @IsEmail()
  @ApiProperty({ description: 'email' })
  @IsNotEmpty()
  email: string

  @ApiProperty({ description: 'password' })
  @MinLength(6)
  @IsNotEmpty()
  password: string
}
