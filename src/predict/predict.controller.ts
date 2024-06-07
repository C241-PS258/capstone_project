import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PredictService } from './predict.service';
import { loadModel } from 'src/model/load.models';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

interface FileUploadRequest extends Request {
    files: {
        [key: string]: any;
    }
}

@Controller('predict')
@UseGuards(JwtAuthGuard)
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
            const label = this.predictService.predictClassification(model, payload);
            return { jenis_ikan: (await label).jenis_ikan, pakan: (await label).pakan, pemeliharaan: (await label).pemeliharaan};
        } catch (error) {
            throw new BadRequestException(`Error in processing the image: ${error.message}`);
        }
    }
}
