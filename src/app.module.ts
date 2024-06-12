import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictModule } from './predict/predict.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [AuthModule, PrismaModule, PredictModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, DashboardService],
})
export class AppModule {}
