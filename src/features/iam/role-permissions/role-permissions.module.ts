import { Module } from '@nestjs/common';

import { RolePermissionsController } from './presentation/http/role-permissions.controller.js';

import { ROLE_PERMISSION_REPOSITORY } from './domain/role-permission.repository.js';

import { RolePermissionPrismaRepository } from './infrastructure/role-permission-prisma.repository.js';

import { RolePermissionsService } from './application/role-permissions.service.js';


@Module({
    controllers: [
        RolePermissionsController,
    ],

    providers: [
        RolePermissionsService,

        {
            provide:
                ROLE_PERMISSION_REPOSITORY,
            useClass:
                RolePermissionPrismaRepository,
        },
    ],

    exports: [
        ROLE_PERMISSION_REPOSITORY,
    ],
})
export class RolePermissionsModule {}