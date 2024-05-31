import { Module } from '@nestjs/common';
import { PredictService } from './predict.service';
import { PredictController } from './predict.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({dest: './uploads'})],
  providers: [PredictService],
  controllers: [PredictController]
})
export class PredictModule {}
