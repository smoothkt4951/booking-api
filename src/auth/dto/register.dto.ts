import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  firstname: string

  @IsNotEmpty()
  lastname: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsNotEmpty()
  passwordConfirm: string
}
