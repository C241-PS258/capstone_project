import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { DashboardService } from './dashboard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  providers: [DashboardService, AuthRepository, JwtService],
  controllers: [DashboardController]
})
export class DashboardModule {}
