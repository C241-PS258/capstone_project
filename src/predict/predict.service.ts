import { Injectable, BadRequestException } from '@nestjs/common';
import * as tfjs from '@tensorflow/tfjs-node';
import { FishQuery } from 'prisma/queries/fish/fish.query';

@Injectable()
export class PredictService {
    constructor(private readonly fishQuery: FishQuery) { }


    async loadModel() {
        const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/tfjs-model/model.json";
        // const modelUrl = "file://data_model/model.json";
        // const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/model.json";
        console.log('ini model');
        return tfjs.loadLayersModel(modelUrl);
    }

    async predictClassification(model, image) {
        try {
            const tensor = tfjs.node.decodeJpeg(image.data)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat();

            const prediction = model.predict(tensor);
            const scores = await prediction.data();

            const maxScoreIndex = scores.indexOf(Math.max(...scores));
            console.log("maxScoreIndex", maxScoreIndex);

            let label, suggestion;
            const ikanLabels = ["Gabus", "Mas", "Lele", "Nila", "Patin"];

            if (maxScoreIndex >= 0 && maxScoreIndex < ikanLabels.length) {
                label = ikanLabels[maxScoreIndex];
                const ikanInfo = await this.fishQuery.getFishByName(label);
                suggestion = `Selamat, Anda memprediksi ikan ${label}! Pakan: ${ikanInfo.pakan}, Pemeliharaan: ${ikanInfo.pemeliharaan}`;                
            } else {
                label = "Tidak Diketahui";
                suggestion = "Hasil prediksi tidak dapat diinterpretasikan.";
            }

            console.log(suggestion, label);

            return { label, suggestion };
        } catch (error) {
            throw new BadRequestException(`Terjadi kesalahan input: ${error.message}`);
        }
    }
}
