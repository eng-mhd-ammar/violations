import { Module } from '@nestjs/common';

import { PermissionsController } from './presentation/http/permissions.controller.js';

import { PermissionRepository } from './domain/permission.repository.js';
import { PermissionPrismaRepository } from './infrastructure/permission-prisma.repository.js';
import { PermissionsService } from './application/user-roles.service.js';

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
