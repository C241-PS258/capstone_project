import { BadRequestException, Controller, Get, Headers } from '@nestjs/common';
import { HistoriesQuery } from 'prisma/queries/histories/histories.query';
import { AuthRepository } from 'src/auth/auth.repository';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly historiesQuery: HistoriesQuery, private readonly authRepository: AuthRepository) { }
    @Get()
    async getHistories(@Headers('authorization') authorization: string) {
        const decodedToken = authorization ? await this.authRepository.decodeJwtToken(authorization) : { id: "-" };

        try {
            const histories = await this.historiesQuery.getByIdUser(decodedToken.id);
            return histories;
        } catch (error) {
            throw new BadRequestException(`Error get data: ${error.message}`);
        }
    }

}
