import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { RegisterPayloadDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    login (dto: AuthPayloadDto) {
        return this.authRepository.login(dto);
    }

    register(dto: RegisterPayloadDto){
        return this.authRepository.register(dto);
    }
}
