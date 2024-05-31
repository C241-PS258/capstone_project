import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('predict')
export class PredictController {
    @Post('fish')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const extension = extname(file.originalname);
                const filename = `${uniqueSuffix}${extension}`;
                cb(null, filename);
            },
        })
    }))
    handleUpload(@UploadedFile() file: Express.Multer.File) {
        console.log("file", file);

        return "predict";
    }
}
