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
            projectId: 'aquaqulture-mate',
            credentials: {
                type: "service_account",
                project_id: "aquaqulture-mate",
                private_key_id: process.env.PRIVATE_KEY_ID,
                private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCknlQYHswUZcJo\n0OV/EKhe1c0DR+2T/1KBu5XMChbMzPT4YXLW07vQPOHde2jgPOpRbCYyn6u8NbdC\nuQRpfYEM2kpSBkTYZ9JOhgTBh+BGI+JmLlMdQUFpOX4j6XdHG2LZ1BUkcyXhjxOR\ndfCxIDp49n+fNdafclDJr7JSL7QHQ9uiuSHq9fC+nl7lfYP1TAjIfJgDSpqoImpj\nbjb+Puh2sHUAP1egksgiglTDLDlvoHJI6SgmQnzGTPWeza6zEQgoaXVLZjc3wxeT\nAqpyxvfSeHTj+w9eDO8l9HGoZQRvUWCKBFWxx5ZcTmcxc2SMDV4Ve/0dOmLcQM0r\n2fcoxY/rAgMBAAECggEAPTmPsErf/yQbqq0q9dfFr0PYVISPdXBMCOkyHOmRskj2\nQVzI/+JO43OJU70e8+tkALV2/XQKRN07lArI+80MTrHvW1NujogKnV7V7P6yqJOX\nFAbdra9D+zVBV2zxClbCrJ5m4KAc8ierEPoq8023wZ54N8gn0zSKnICGk2+fhuWa\nQv0fPRx+jPwhxHwFCaRB6P0ekbAwALTjpdonBK2YcPSsWz9cMjkTsbO7k0lik3BO\nlBRBHGDSfvZIxrV63tDLQVR+5xkdbCun3N+qTc477hLE8kjGDlxdPMUnN7x7NYTj\n1ozI/9fmE8Nw0+fnOUVBk2z4X+E850Cybz1wBh4ZfQKBgQDgKP5r5UdxyDlFrAhJ\nzldCWLlruTt9RNcI7ucsONA4UXlqgT0riMlIizLV71PVfstpuRAOt+1PMttXpAZ0\nwlncpApC998bkve5o811JR0EPgTDHXX8RPa0ebqbMiRZ7yR0qEPTz7Y571LgPs06\nKskoVTf6eFQ5eaQ7SBn3iNiJ/wKBgQC8AEFiwksYj4NVWKymbHMvoTxE+mSMMtSc\njUImhB6hHuAYgJ5OoWRDUru/+d76IeGhoBekMpPu90URKz2Y2c6l8QE1w9Qb4IXb\n86JsvMMKR0aBinfGRiUEHVo+g52EM8mn6JJ+gU0w4n4g1LgPmJW1OKtGl+v0yunl\nBmpvU5HCFQKBgG19OIBlFleKUAcq90Vtpwt+INtwN5GBbXMslffwrCvGCAMwqzs3\nbfGkJCmA47b1Xs/+F8zIo/46Pg75zDl9sLzn1ydMwUpLp/qh+roMbbbjwBm5qyaU\nXNhcWPxzKnRPLcRZZ//uhfiYYCeuJToTKfwsW9JYsfL86m4WUrCow/PrAoGAcqFV\nPPpq/5bB5ZAj9XW65hfRv91M4Y88xBf9da6pXmSND2OdIySVFdekUvHwW2O9R+dt\ngti0CskKe+V5sXFc5yGEM1wsQLMt62cqalLOOb4r52Cel269szySgfuOV8Wb951/\ndVMx1dTEQxBxClFnNxBOnsSTQrdW1iaLT0YNYeECgYAT9HUkcm5KoGzZKGk40xZi\nunL36YGy+0yyfbTbM8cQPy9lL5yFDyXEX1HR/ogmMC4bUF5AFMpbHr85WVdymVNF\nsQnd4E1OYwiFo6PVBZf5wm4abqQ9HUN94Ob/NYL/rGJy2PBNIwDil0AKgag8kXvh\nujOCG05LGyTOrdvbIJ1CbQ==\n-----END PRIVATE KEY-----\n",
                client_email: "413576317560-compute@developer.gserviceaccount.com",
                client_id: "108505624243467714983",
            }
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
            const scoresArray = await prediction.data();
            const maxScore = Math.max(...scoresArray);
            const maxScoreIndex = scoresArray.indexOf(maxScore);
            const decodedToken = token ? await this.authRepository.decodeJwtToken(token) : { id: "guest" };
            const ikanLabels = ["Gabus", "Mas", "Lele", "Nila", "Patin"];
            const imageUrl = await this.uploadFile(image);

            if (maxScoreIndex >= 0) {
                if (maxScoreIndex < ikanLabels.length && maxScore >= 0.8) {
                    const jenis_ikan = ikanLabels[maxScoreIndex];
                    const ikanInfo = await this.fishQuery.getFishByName(jenis_ikan, imageUrl, decodedToken.id);
                    return { jenis_ikan, pakan: ikanInfo.pakan, pemeliharaan: ikanInfo.pemeliharaan };
                } else {
                    return { jenis_ikan: "Tidak Diketahui", pakan: "Tidak Diketahui", pemeliharaan: "Tidak Diketahui" };
                }
            } else {
                return { jenis_ikan: "Tidak Diketahui", pakan: "Tidak Diketahui", pemeliharaan: "Tidak Diketahui" };
            }
        } catch (error) {
            throw new BadRequestException(`Terjadi kesalahan input gambar: ${error.message}`);
        }
    }
}
