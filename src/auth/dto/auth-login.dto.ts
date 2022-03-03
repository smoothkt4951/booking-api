import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthLoginDto {
  @ApiProperty({description: 'Email to login'})
  @IsEmail()
  email: string

  @ApiProperty({description: "Password to login"})
  @IsNotEmpty()
  password: string
}
