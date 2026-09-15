import { Module } from '@nestjs/common';

import { RolesController } from './presentation/http/roles.controller.js';

import { ROLE_REPOSITORY, RoleRepository } from './domain/role.repository.js';
import { RolePrismaRepository } from './infrastructure/role-prisma.repository.js';
import { RolesService } from './application/roles.service.js';
import { RolePermissionsModule } from '../role-permissions/role-permissions.module.js';

@Module({
    controllers: [
        RolesController,
    ],

    providers: [
        RolesService,
        
        {
            provide: ROLE_REPOSITORY,
            useClass: RolePrismaRepository,
        },
    ],

    imports: [
        RolePermissionsModule,
    ]
})
export class RolesModule {}