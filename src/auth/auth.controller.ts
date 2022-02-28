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
import { Response, Request } from 'express'
import { Redis } from 'ioredis'
import { Role } from 'src/user/user.entity'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { AuthLoginDto } from './dto/auth-login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { Roles } from './decorators/roles.decorator'
import { RolesGuard } from './guards/roles.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto)
  }

  @Post('register')
  @Public()
  async register(@Body() authRegisterDto: RegisterDto) {
    return this.authService.register(authRegisterDto)
  }

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async test(@Req() req) {
    return req.user
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization.split(' ')[1]
    try {
      // console.log(token);
      await this.redisClient.lpush('token', token)
      return res.status(200).json({
        status: 200,
        data: 'You are logged out',
      })
    } catch (error) {
      throw new HttpException('Server logout error', 500)
    }
  }
}
