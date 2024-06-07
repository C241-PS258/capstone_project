import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
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
    async handleUpload(@Req() req: FileUploadRequest) {
        const image = req.files?.image;

        if (!image) {
            throw new BadRequestException('No file uploaded or file field name is incorrect');
        }

        const model = await loadModel();

        try {
            const payload = image;
            // console.log('Payload:', payload);
            const label = this.predictService.predictClassification(model, payload);
            return { prediction: (await label).suggestion, label: (await label).label };
        } catch (error) {
            throw new BadRequestException(`Error in processing the image: ${error.message}`);
        }
    }
}
