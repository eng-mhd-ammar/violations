import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module.js';
import { PermissionsModule } from './permissions/permissions.module.js';

@Module({
    imports: [
        UsersModule,
        PermissionsModule,
    ],
})
export class IamModule {}