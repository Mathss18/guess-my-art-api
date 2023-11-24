import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'minimal',
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-expect-error as we're using a private API
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
