import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error({ error });
    }
  }
}
