import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service.js';
import { AUTH_REPOSITORY } from './domain/auth.repository.js';
import { AuthPrismaRepository } from './infrastructure/auth-prisma.repository.js';
import { AuthController } from './presentation/http/auth.controller.js';
import { JwtStrategy } from './presentation/http/strategies/jwt.strategy.js';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET!,

      signOptions: {
        expiresIn:
          (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ??
            '1h') as SignOptions['expiresIn'],
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,

    JwtStrategy,

    {
      provide: AUTH_REPOSITORY,

      useClass:
        AuthPrismaRepository,
    },
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
  
export class AuthModule {}