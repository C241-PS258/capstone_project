import { BadRequestException, Injectable } from "@nestjs/common";
import { DbService } from "prisma/db.service";


@Injectable()
export class FishQuery extends DbService {
    // async getFishByName(fishName: string, imageUrl: string) {
    async getFishByName(fishName: string, imageUrl: string, idUser:string) {
        try {
            const fish = await this.prisma.fish.findUnique({
                where: { nama: fishName },
            });
            if (!fish) {
                throw new BadRequestException(`Fish ${fishName} not found in the database.`);
            }

            const createdHistory = await this.prisma.histories.create({
                data: {
                    image: imageUrl,
                    idUser: idUser,
                    timestamp: new Date(),
                }
            });

            return fish;
        } catch (error) {
            throw new BadRequestException(`Error fetching data for ${fishName}: ${error.message}`);
        }
    }

}