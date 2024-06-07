import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';
import { UserQuery } from './queries/user/user.query';
import { FishQuery } from './queries/fish/fish.query';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PrismaService, UserQuery, FishQuery],
  exports: [PrismaService, DbService, UserQuery, FishQuery],
})
export class PrismaModule { }
