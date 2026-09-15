import { Module } from '@nestjs/common';
import { PermissionsController } from './presentation/http/permissions.controller.js';
import { PermissionPrismaRepository } from './infrastructure/permission-prisma.repository.js';
import { PermissionsService } from './application/permissions.service.js';
import { PERMISSION_REPOSITORY } from '../permissions/domain/permission.repository.js';

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
