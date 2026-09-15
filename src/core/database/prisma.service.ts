import { Injectable, OnModuleInit } from '@nestjs/common';

import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit {
  public readonly db = db;

  async onModuleInit(): Promise<void> {
    await this.db.connect();
  }
}