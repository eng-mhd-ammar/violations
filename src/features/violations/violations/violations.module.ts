import { Module } from '@nestjs/common';
import { ViolationsController } from './../violations/presentation/http/violations.controller.js';
import { ViolationsService } from './../violations/application/violations.service.js';
import { VIOLATION_REPOSITORY } from './../violations/domain/violation.repository.js';
import { ViolationPrismaRepository } from '.././violations/infrastructure/violation-prisma.repository.js';

@Module({
    controllers: [
        ViolationsController,
    ],

    providers: [
        ViolationsService,

        {
            provide: VIOLATION_REPOSITORY,
            useClass: ViolationPrismaRepository,
        },
    ],
})
    
export class ViolationsModule {}