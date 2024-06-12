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
                throw new BadRequestException(`Fish ${fishName} not found in the database.`);
            }

            // Membuat entri baru dalam tabel HistoriesFish
            const createdHistory = await this.prisma.histories.create({
                data: {
                    image: 'imageURL', // Anda perlu menentukan URL gambar
                    timestamp: new Date(), // Timestamp saat ini
                    // fish: { connect: { id: fish.id } } // Menghubungkan dengan entri ikan yang ditemukan
                }
            });

            return createdHistory;
        } catch (error) {
            throw new BadRequestException(`Error creating history for ${fishName}: ${error.message}`);
        }
    }

    async getByIdUser(idUser: string) {
        try {
            const histories = await this.prisma.histories.findMany({
                where: { idUser },
                orderBy: { timestamp: 'desc' },
            });
            return histories;
        } catch (error) {
            throw new BadRequestException(`Error retrieving histories for user ${idUser}: ${error.message}`);
        }
    }
}