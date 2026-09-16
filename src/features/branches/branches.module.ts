import { BRANCH_REPOSITORY } from './domain/branch.repository.js';
import { Module } from '@nestjs/common';
import { BranchesController } from './presentation/http/branches.controller.js';
import { BranchesService } from './application/branches.service.js';
import { BranchPrismaRepository } from './infrastructure/branch-prisma.repository.js';

@Module({
    controllers: [
        BranchesController,
    ],

    providers: [
        BranchesService,

        {
            provide: BRANCH_REPOSITORY,
            useClass: BranchPrismaRepository,
        },
    ],
})

export class BranchesModule {}