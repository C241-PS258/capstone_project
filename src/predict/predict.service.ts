import { Injectable, BadRequestException } from '@nestjs/common';
import * as tfjs from '@tensorflow/tfjs-node';
import { FishQuery } from 'prisma/queries/fish/fish.query';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class PredictService {
    private storage: Storage;
    private bucketName: string;
    private folderName: string;
    constructor(private readonly fishQuery: FishQuery, private readonly authRepository: AuthRepository) {
        this.storage = new Storage({
            keyFilename: 'secret_key.json',
            projectId: 'aquaqulture-mate',
        });
        this.bucketName = 'aquaculture_mate-bucket';
        this.folderName = 'history-image';
    }

    async uploadFile(file: any): Promise<string> {
        const filename = uuidv4() + '-aquaqulture';
        const filePath = `${this.folderName}/${filename}`;
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(filePath);

        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            }
        });

        return new Promise((resolve, reject) => {
            blobStream
                .on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
                    resolve(publicUrl);
                })
                .on('error', (err) => {
                    reject(`Gagal upload gambar, ulangi upload gambar`);
                })
                .end(file.data);
        });
    }

    async predictClassification(model, image, token) {
        try {
            const tensor = tfjs.node.decodeJpeg(image.data)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat()
                .div(tfjs.scalar(255));

            const prediction = model.predict(tensor);
            const scores = await prediction.data();
            const maxScoreIndex = scores.indexOf(Math.max(...scores));

            const decodedToken = token ? await this.authRepository.decodeJwtToken(token) : { id: "guest" };

            let jenis_ikan = "Tidak Diketahui", pakan = "Tidak Diketahui", pemeliharaan = "Tidak Diketahui";

            const ikanLabels = ["Gabus", "Mas", "Lele", "Nila", "Patin"];
            const imageUrl = await this.uploadFile(image);
            console.log("image url: ", imageUrl);

            if (maxScoreIndex >= 0 && maxScoreIndex < ikanLabels.length) {
                jenis_ikan = ikanLabels[maxScoreIndex];
                const ikanInfo = await this.fishQuery.getFishByName(jenis_ikan, imageUrl, decodedToken.id);
                pakan = ikanInfo.pakan;
                pemeliharaan = ikanInfo.pemeliharaan;
            }

            return { jenis_ikan, pakan, pemeliharaan };
        } catch (error) {
            throw new BadRequestException(`Terjadi kesalahan input gambar, ulangi input gambar`);
        }
    }
}
