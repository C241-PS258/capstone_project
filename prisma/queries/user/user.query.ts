import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { RegisterPayloadDto } from 'src/auth/dto/register.dto';


@Injectable()
export class UserQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByUsername(username: string) {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                ],
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                ],
            },
        });
    }

    async create(data: RegisterPayloadDto) {
        return await this.prisma.user.create({ data })
    }
}