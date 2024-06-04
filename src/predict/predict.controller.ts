import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { loadModel, predict, predictClassification } from 'src/model/load.models';

interface FileUploadRequest extends Request {
    files: {
        [key: string]: any;
    }
}

@Controller('predict')
export class PredictController {
    @Post('fish')
    // async handleUpload(@Req() req: FileUploadRequest) {
    //     const image = req.files?.image;
    //     const model = await loadModel();

    //     if (image) {
    //         const payload = image.data
    //         console.log(payload);

    //         const label = await predictClassification(model, image);
    //     } else {
    //         return { error: 'No file uploaded or file field name is incorrect' };
    //     }
    // }
    async handleUpload(@Req() req: FileUploadRequest) {
        const image = req.files?.image;

        if (!image) {
            throw new BadRequestException('No file uploaded or file field name is incorrect');
        }

        const model = await loadModel();

        try {
            const payload = image;
            // console.log('Payload:', payload);
            const label = await predictClassification(model, payload);
            return { prediction: label };
        } catch (error) {
            throw new BadRequestException(`Error in processing the image: ${error.message}`);
        }
    }
}
