import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictModule } from './predict/predict.module';

@Module({
  imports: [AuthModule, PrismaModule, PredictModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
