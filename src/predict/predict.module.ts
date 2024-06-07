import { Module } from '@nestjs/common';
import { PredictService } from './predict.service';
import { PredictController } from './predict.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [MulterModule.register({dest: './uploads'}), PrismaModule],
  providers: [PredictService],
  controllers: [PredictController]
})
export class PredictModule {}
