import { Module } from '@nestjs/common';
import { ViolationsController } from './violations/presentation/http/violations.controller';
import { ViolationsService } from './violations/application/violations.service';
import { VIOLATION_REPOSITORY } from './violations/domain/violation.repository';
import { ViolationPrismaRepository } from './violations/infrastructure/violation-prisma.repository';

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