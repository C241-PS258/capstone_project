import { BadRequestException, Controller, Headers, Post, Req} from '@nestjs/common';
import { Request } from 'express';
import { PredictService } from './predict.service';
import { loadModel } from 'src/model/load.models';

interface FileUploadRequest extends Request {
    files: {
        [key: string]: any;
    }
}

@Controller('predict')
export class PredictController {
    constructor(private predictService: PredictService) { }
    @Post('fish')
    async handleUpload(@Req() req: FileUploadRequest, @Headers('authorization') authorization: string) {
        const image = req.files?.image;

        if (!image) {
            throw new BadRequestException('Gambar belum diinput');
        }

        const model = await loadModel();

        try {
            const payload = image;
            console.log("payload", payload);
            
            const label = this.predictService.predictClassification(model, payload, authorization);

            return { jenis_ikan: (await label).jenis_ikan, pakan: (await label).pakan, pemeliharaan: (await label).pemeliharaan };
        } catch (error) {
            throw new BadRequestException(`Error: ${error.message}`);
        }
    }
}
