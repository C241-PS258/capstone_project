import { BadRequestException, Injectable } from "@nestjs/common";
import { DbService } from "prisma/db.service";


@Injectable()
export class FishQuery extends DbService {
    async getFishByName(fishName: string, imageUrl: string, idUser: string) {
        try {
            const fish = await this.prisma.fish.findUnique({
                where: { nama: fishName },
            });
            if (!fish) {
                throw new BadRequestException(`Fish ${fishName} not found in the database.`);
            }

            const dateNow = new Date();
            const predictHarvest = new Date(dateNow.setMonth(dateNow.getMonth() + 6));
            const predictHarvestFormatted = `${predictHarvest.getDate()}-${(predictHarvest.getMonth() + 1).toString().padStart(2, '0')}-${predictHarvest.getFullYear()}`;


            const createdHistory = await this.prisma.histories.create({
                data: {
                    image: imageUrl,
                    idUser: idUser,
                    nameFish: fishName,
                    harvestPredictions: predictHarvestFormatted,
                    timestamp: dateNow,
                }
            });

            return fish;
        } catch (error) {
            throw new BadRequestException(`Gagal mengambil data ikan ${fishName}`);
        }
    }

}