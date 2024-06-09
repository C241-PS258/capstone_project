import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';
import { UserQuery } from './queries/user/user.query';
import { FishQuery } from './queries/fish/fish.query';
import { HistoriesQuery } from './queries/histories/histories.query';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PrismaService, UserQuery, FishQuery, HistoriesQuery],
  exports: [PrismaService, DbService, UserQuery, FishQuery, HistoriesQuery],
})
export class PrismaModule { }
