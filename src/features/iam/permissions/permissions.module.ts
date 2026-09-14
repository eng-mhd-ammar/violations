import { Module } from '@nestjs/common';

import { PermissionsController } from './presentation/http/permissions.controller.js';

import { PERMISSION_REPOSITORY } from './domain/permission.repository.js';
import { PermissionPrismaRepository } from './infrastructure/permission-prisma.repository.js';
import { PermissionsService } from './application/permissions.service.js';

@Module({
    controllers: [
        PermissionsController,
    ],

    providers: [
        PermissionsService,

        {
            provide: PERMISSION_REPOSITORY,
            useClass: PermissionPrismaRepository,
        },
    ],
})
export class PermissionsModule {}
