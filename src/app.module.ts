import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './core/database/prisma.module.js';
import { AuthModule } from './features/auth/auth.module.js';
import { UsersModule } from './features/iam/users/users.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
  ]
})
export class AppModule {}
