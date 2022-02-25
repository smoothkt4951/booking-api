import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(authLoginDto: AuthLoginDto): Promise<UserEntity> {
    const { email, password } = authLoginDto;

    const user = await this.usersService.findUserBy({ email });
    if (!(await user?.validatePassword(password))) {
      throw new HttpException(
        'Email or Password is invalid!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.passwordConfirm) {
      throw new BadRequestException('Password do not match!');
    }
    const { firstname, lastname, email, password } = registerDto;

    return this.usersService.createUser({
      firstname,
      lastname,
      email,
      password,
    });
  }
}
