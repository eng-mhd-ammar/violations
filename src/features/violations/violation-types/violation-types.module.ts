import { VIOLATION_TYPE_REPOSITORY } from './domain/violation-type.repository.js';
import { Module } from '@nestjs/common';
import { ViolationTypesController } from './presentation/http/violation-types.controller.js';
import { ViolationTypesService } from './application/violation-types.service.js';
import { ViolationTypePrismaRepository } from './infrastructure/violation-type-prisma.repository.js';

@Module({
    controllers: [
        ViolationTypesController,
    ],

    providers: [
        ViolationTypesService,

        {
            provide: VIOLATION_TYPE_REPOSITORY,
            useClass: ViolationTypePrismaRepository,
        },
    ],
})

export class ViolationTypesModule {}