import { BadRequestException, Controller, Get, Headers } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HistoriesQuery } from 'prisma/queries/histories/histories.query';
import { AuthRepository } from 'src/auth/auth.repository';

@Controller('dashboard')
export class DashboardController {
    constructor(private prisma: PrismaService, private readonly historiesQuery: HistoriesQuery, private readonly authRepository: AuthRepository ) { }
    @Get()
    async getHistories(@Headers('authorization') authorization: string) {
        const decodedToken = await this.authRepository.decodeJwtToken(authorization);

        try {
            const histories = await this.historiesQuery.getByIdUser(decodedToken.id);
            return histories;
        } catch (error) {
            throw new BadRequestException(`Error get data: ${error.message}`);
        }
    }

}
