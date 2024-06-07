import { Injectable, BadRequestException } from '@nestjs/common';
import * as tfjs from '@tensorflow/tfjs-node';
import { FishQuery } from 'prisma/queries/fish/fish.query';

@Injectable()
export class PredictService {
    constructor(private readonly fishQuery: FishQuery) { }

    async predictClassification(model, image) {
        try {
            const tensor = tfjs.node.decodeJpeg(image.data)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat()
                .div(tfjs.scalar(255));

            const prediction = model.predict(tensor);
            const scores = await prediction.data();

            const maxScoreIndex = scores.indexOf(Math.max(...scores));

            let jenis_ikan, pakan, pemeliharaan;
            const ikanLabels = ["Gabus", "Mas", "Lele", "Nila", "Patin"];

            if (maxScoreIndex >= 0 && maxScoreIndex < ikanLabels.length) {
                jenis_ikan = ikanLabels[maxScoreIndex];
                const ikanInfo = await this.fishQuery.getFishByName(jenis_ikan);
                pakan = ikanInfo.pakan;
                pemeliharaan = ikanInfo.pemeliharaan;
            } else {
                ({ jenis_ikan, pakan, pemeliharaan } = { jenis_ikan: "Tidak Diketahui", pakan: "Tidak Diketahui", pemeliharaan: "Tidak Diketahui" });
            }

            return { jenis_ikan, pakan, pemeliharaan };
        } catch (error) {
            throw new BadRequestException(`Terjadi kesalahan input: ${error.message}`);
        }
    }
}
