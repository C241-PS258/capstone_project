import { BadRequestException, Injectable } from "@nestjs/common";
import { DbService } from "prisma/db.service";


@Injectable()
export class HistoriesQuery extends DbService {
    async createHistory(fishName: string) {
        try {
            const fish = await this.prisma.fish.findUnique({
                where: { nama: fishName },
            });
            if (!fish) {
                throw new BadRequestException(`Gagal mengambil data ikan ${fishName} .`);
            }

            const createdHistory = await this.prisma.histories.create({
                data: {
                    image: 'imageURL',
                    nameFish: fishName,
                    timestamp: new Date(),
                }
            });

            return createdHistory;
        } catch (error) {
            throw new BadRequestException(`Gagal membuat data, ulangi input gambar`);
        }
    }

    async getByIdUser(idUser: string) {
        try {
            if (idUser === '-') {
                return { message: "guest access" };
            }
            const histories = await this.prisma.histories.findMany({
                where: { idUser },
                orderBy: { timestamp: 'desc' },
                include: {
                    fish: {
                        select: {
                            pakan: true,
                            pemeliharaan: true
                        }
                    }
                }
            });
            return histories;
        } catch (error) {
            throw new BadRequestException(`Gagal mengambil data user`);
        }
    }
}