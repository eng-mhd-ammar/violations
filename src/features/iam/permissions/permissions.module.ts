import { Module } from '@nestjs/common';

import { PermissionsController } from './presentation/http/permissions.controller.js';
import { PermissionsService } from './application/permissions.service.js';

import { PermissionRepository } from './domain/permission.repository.js';
import { PermissionPrismaRepository } from './infrastructure/permission-prisma.repository.js';

@Module({
    controllers: [
        PermissionsController,
    ],

    providers: [
        PermissionsService,

        {
            provide: PermissionRepository,
            useClass: PermissionPrismaRepository,
        },
    ],
})
export class PermissionsModule {}
