import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';


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
}