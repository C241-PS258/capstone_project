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