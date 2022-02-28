import { InjectRedis } from '@liaoliaots/nestjs-redis'
import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { Redis } from 'ioredis/built'
import { Role } from 'src/user/user.entity'
import { AuthService } from './auth.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private readonly redisService: RedisService, //@InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto)
  }

  @Post('register')
  async register(@Body() authRegisterDto: RegisterDto) {
    return this.authService.register(authRegisterDto)
  }

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async test(@Req() req) {
    return req.user
  }

  // @Post('logout')
  // async logout(@Body('token') token: string, @Res() res: Response) {
  //   // const token = req.headers.authorization.split(' ')[1];
  //   // const redisClient = await this.redisService.getClient();
  //   try {
  //     // console.log(token);
  //     await this.redisClient.lpush('token', token);
  //     return res.status(200).json({
  //       status: 200,
  //       data: 'You are logged out',
  //     });
  //   } catch (error) {
  //     throw new HttpException('Server logout error', 500);
  //   }
  // }
}
