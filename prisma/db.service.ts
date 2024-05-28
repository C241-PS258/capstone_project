import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DbService {
    constructor(
        protected readonly prisma: PrismaService,

    ) { }

    protected async execTx(fn: (tx: Prisma.TransactionClient) => Promise<void>) {
        await this.prisma.$transaction(async (tx) => {
            await fn(tx)
        })
    }
}