import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterPayloadDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Body() authPayload: AuthPayloadDto) {
        const user = this.authService.login(authPayload)
        return user;
    }

    @Post('register')
    register(@Body() authPayload: RegisterPayloadDto) {
        const user = this.authService.register(authPayload)
        return user;
    }



    @Get('status')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: Request) {
        return req.user
    }
}
