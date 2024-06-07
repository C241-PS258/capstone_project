import { BadRequestException, Injectable } from "@nestjs/common";
import { DbService } from "prisma/db.service";


@Injectable()
export class FishQuery extends DbService {
    async getFishByName(fishName: string) {
        try {
            const fish = await this.prisma.fish.findUnique({
                where: { nama: fishName },
            });
            if (!fish) {
                throw new BadRequestException(`Fish ${fishName} not found in the database.`);
            }
            return fish;
        } catch (error) {
            throw new BadRequestException(`Error fetching data for ${fishName}: ${error.message}`);
        }
    }
}