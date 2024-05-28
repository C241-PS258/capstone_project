import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';
import { UserQuery } from './queries/user/user.query';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PrismaService, UserQuery],
  exports: [PrismaService, DbService, UserQuery],
})
export class PrismaModule { }
