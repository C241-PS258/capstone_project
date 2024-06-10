import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserQuery } from "prisma/queries/user/user.query";
import { AuthPayloadDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import { RegisterPayloadDto } from "./dto/register.dto";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly userQuery: UserQuery,
        private jwtService: JwtService,
    ) { }

    async findUserByEmailOrThrow(Email: string) {
        const user = await this.userQuery.findByEmail(Email);
        if (!user) {
            throw new BadRequestException('Email belum terdaftar');
        }
        return user;
    }

    async decodeJwtToken(accessToken: string) {
        const decodedJwt = this.jwtService.decode(accessToken.split(' ')[1],);
        return decodedJwt;
    }


    /*
      |--------------------------------------------------------------------------
      | Auth user function
      |--------------------------------------------------------------------------
      */

    async login(dto: AuthPayloadDto) {
        dto.email = dto.email.toLowerCase().trim();
        const user = await this.findUserByEmailOrThrow(dto.email);
        
        const validPassword = await bcrypt.compare(dto.password, user.password);

        if (!validPassword) {
            throw new BadRequestException('Password salah');
        }
        return this.jwtService.sign(user)
    }

    async register(dto: RegisterPayloadDto) {
        dto.email = dto.email.toLowerCase().trim();
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);
        try {
            dto.password = hash;
            await this.checkEmailExist(dto.email);

            const createUser = await this.userQuery.create(dto)
            if (!createUser) throw new BadRequestException('User gagal ditambahkan');
            return createUser
        } catch (error) {
            throw error;
        }
    }


    /*
     |--------------------------------------------------------------------------
     | Helper auth function
     |--------------------------------------------------------------------------
     */

    async checkEmailExist(email: string) {
        const user = await this.userQuery.findByEmail(email);
        if (user) {
            throw new BadRequestException('Email sudah terdaftar');
        }
    }
}