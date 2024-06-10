import { Module } from '@nestjs/common';
import { PredictService } from './predict.service';
import { PredictController } from './predict.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MulterModule.register({dest: './uploads'}), PrismaModule],
  providers: [PredictService, AuthRepository, JwtService],
  controllers: [PredictController]
})
export class PredictModule {}
