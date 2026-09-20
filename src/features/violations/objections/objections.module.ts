import { OBJECTION_REPOSITORY } from './domain/objection.repository.js';
import { Module } from '@nestjs/common';
import { ObjectionsController } from './presentation/http/objections.controller.js';
import { ObjectionsService } from './application/objections.service.js';
import { ObjectionPrismaRepository } from './infrastructure/objection-prisma.repository.js';

@Module({
    controllers: [
        ObjectionsController,
    ],

    providers: [
        ObjectionsService,

        {
            provide: OBJECTION_REPOSITORY,
            useClass: ObjectionPrismaRepository,
        },
    ],
})
    
export class ObjectionsModule {}