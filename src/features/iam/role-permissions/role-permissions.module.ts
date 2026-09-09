import { Module } from '@nestjs/common';
import { RolePermissionsController } from './presentation/http/role-permissions.controller.js';
import { RolePermissionsService } from './application/user-roles.service.js';
import { RolePermissionRepository } from './domain/user-role.repository.js';
import { RolePermissionPrismaRepository } from './infrastructure/user-role-prisma.repository.js';

@Module({
    controllers: [
        RolePermissionsController,
    ],

    providers: [
        RolePermissionsService,

        {
            provide: RolePermissionRepository,
            useClass: RolePermissionPrismaRepository,
        },
    ],

    exports: [
        RolePermissionRepository,
        RolePermissionsService,
    ],
})
export class RolePermissionsModule {}