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

    async findUserByUsernameOrThrow(usernameOrEmail: string) {
        const user = await this.userQuery.findByUsername(usernameOrEmail);
        if (!user) {
            throw new BadRequestException('User belum terdaftar');
        }
        return user;
    }


    /*
      |--------------------------------------------------------------------------
      | Auth user function
      |--------------------------------------------------------------------------
      */

    async login(dto: AuthPayloadDto) {
        dto.username = dto.username.toLowerCase().trim();
        const user = await this.findUserByUsernameOrThrow(dto.username);
        const validPassword = await bcrypt.compare(dto.password, user.password);

        if (!validPassword) {
            throw new BadRequestException('Password salah');
        }
        return this.jwtService.sign(user)
    }

    async register(dto: RegisterPayloadDto) {
        dto.username = dto.username.toLowerCase().trim();
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);
        try {
            dto.password = hash;
            await this.checkUserExist(dto.username);
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

    async checkUserExist(username: string) {
        const user = await this.userQuery.findByUsername(username);
        if (user) {
            throw new BadRequestException('User sudah terdaftar');
        }
    }

    async checkEmailExist(email: string) {
        const user = await this.userQuery.findByEmail(email);
        if (user) {
            throw new BadRequestException('Email sudah terdaftar');
        }
    }
}