import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './core/database/prisma.module.js';

import { AuthModule } from './features/auth/auth.module.js';
import { AuthorizationModule } from './core/authorization/authorization.module.js';
import { PermissionGuard } from './core/authorization/guards/permission.guard.js';
import { JwtAuthGuard } from './features/auth/presentation/http/guards/jwt-auth.guard.js';

import { IamModule } from './features/iam/iam.module.js';
import { LocationModule } from './features/locations/locations.module.js';

import { ValidationModule } from './core/validation/validation.module.js';

import { ExistsValidator } from './core/validation/validators/exists.validator.js';
import { UniqueValidator } from './core/validation/validators/unique.validator.js';
import { UniqueNotDeletedValidator } from './core/validation/validators/unique-not-deleted.validator.js';
import { NotSoftDeletedValidator } from './core/validation/validators/not-soft-deleted.validator.js';

import { RequestContextMiddleware } from './core/http/middleware/request-context.middleware.js';
import { BranchesModule } from './features/branches/branches.module.js';
import { PaymentsModule } from './features/payments/payments.module.js';
import { ViolationModule } from './features/violations/violations.module.js';
import { CitizensModule } from './features/citizens/citizens.module.js';

@Module({
    imports: [
        PrismaModule,
        
        AuthModule,
        AuthorizationModule,
        ValidationModule,
        
        IamModule,
        LocationModule,
        PaymentsModule,
        BranchesModule,
        ViolationModule,
        CitizensModule,
    ],

    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },

        ExistsValidator,
        UniqueValidator,
        UniqueNotDeletedValidator,
        NotSoftDeletedValidator,
    ],
})
    
export class AppModule implements NestModule {
    configure(
        consumer: MiddlewareConsumer,
    ): void {
        consumer
            .apply(RequestContextMiddleware)
            .forRoutes('*');
    }
}