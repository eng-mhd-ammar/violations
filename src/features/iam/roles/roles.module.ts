import { Module } from '@nestjs/common';

import { RolesController } from './presentation/http/roles.controller.js';

import { RoleRepository } from './domain/role.repository.js';
import { RolePrismaRepository } from './infrastructure/role-prisma.repository.js';
import { RolesService } from './application/roles.service.js';

@Module({
    controllers: [
        RolesController,
    ],

    providers: [
        RolesService,

        {
            provide: RoleRepository,
            useClass: RolePrismaRepository,
        },
    ],
})
export class RolesModule {}