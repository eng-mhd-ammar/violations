import { Module } from '@nestjs/common';

import { UserRolePrismaRepository } from './infrastructure/user-role-prisma.repository.js';
import { USER_ROLE_REPOSITORY, UserRoleRepository } from './domain/user-role.repository.js';
import { UserRolesService } from './application/user-roles.service.js';
import { UserRolesController } from './presentation/http/user-roles.controller.js';

@Module({
    controllers: [
        UserRolesController,
    ],

    providers: [
        UserRolesService,
        
        {
            provide: USER_ROLE_REPOSITORY,
            useClass: UserRolePrismaRepository,
        },
    ],
})

export class UserRolesModule {}