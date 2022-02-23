import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

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

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User, Role.Admin)
    async test(@Req() req) {
        return req.user;
    }
}
