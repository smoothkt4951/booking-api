import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('register')
  async register(@Body() authRegisterDto: RegisterDto) {
    return this.authService.register(authRegisterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async test(@Req() req) {
    return req.user;
  }
}
