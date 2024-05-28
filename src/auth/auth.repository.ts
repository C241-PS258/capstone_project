import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserQuery } from "prisma/queries/user/user.query";
import { AuthPayloadDto } from "./dto/auth.dto";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly userQuery: UserQuery,
        private jwtService: JwtService,
    ) { }

    async login(dto: AuthPayloadDto) {
        const user = await this.userQuery.findByUsername(dto.username)

        if (!user) throw new HttpException('user tidak ditemukan', 401)
        if (user.password !== dto.password) throw new HttpException('password salah', 401)
        return this.jwtService.sign(user)
    }
}