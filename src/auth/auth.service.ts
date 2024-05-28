import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    login (dto: AuthPayloadDto) {
        return this.authRepository.login(dto);
    }
}
