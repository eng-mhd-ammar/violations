import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { PermissionsModule } from './permissions/permissions.module.js';
import { RolesModule } from './roles/roles.module.js';
import { UserRolesModule } from './user-roles/user-roles.module.js';
import { RolePermissionsModule } from './role-permissions/role-permissions.module.js';

@Module({
    imports: [
        UsersModule,
        PermissionsModule,
        RolesModule,
        UserRolesModule,
        RolePermissionsModule,
    ],
})
    
export class IamModule {}