import { BadRequestException, Controller, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PredictService } from './predict.service';
import { loadModel } from 'src/model/load.models';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { HistoriesQuery } from 'prisma/queries/histories/histories.query';

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
            throw new BadRequestException('No file uploaded or file field name is incorrect');
        }

        const model = await loadModel();

        try {
            const payload = image;
            const label = this.predictService.predictClassification(model, payload, authorization);
            // const createdHistory = await this.historiesQuery.createHistory(label.jenis_ikan);

            return { jenis_ikan: (await label).jenis_ikan, pakan: (await label).pakan, pemeliharaan: (await label).pemeliharaan };
        } catch (error) {
            throw new BadRequestException(`Error in processing the image: ${error.message}`);
        }
    }
}
