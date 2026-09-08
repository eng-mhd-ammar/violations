import { Module } from '@nestjs/common';

import { UsersController } from './presentation/http/users.controller.js';
import { UsersService } from './application/users.service.js';
import { UserRepository } from './domain/user.repository.js';
import { UserPrismaRepository } from './infrastructure/user-prisma.repository.js';

@Module({
    controllers: [
        UsersController,
    ],

    providers: [
        UsersService,
        
        {
            provide: UserRepository,
            useClass: UserPrismaRepository,
        },
    ],
})
export class UsersModule {}