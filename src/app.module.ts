import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './core/database/prisma.module.js';

import { AuthModule } from './features/auth/auth.module.js';
import { UsersModule } from './features/iam/users/users.module.js';

import { AuthorizationModule } from './core/authorization/authorization.module.js';

import { PermissionGuard } from './core/authorization/guards/permission.guard.js';
import { JwtAuthGuard } from './features/auth/presentation/http/guards/jwt-auth.guard.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AuthorizationModule,
  ],

  providers: [
    // 1. Authentication
    {
      provide: APP_GUARD,
      useFactory: () => new JwtAuthGuard,
    },

    // 2. Authorization
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}