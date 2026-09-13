import { STATE_REPOSITORY } from './domain/state.repository.js';
import { Module } from '@nestjs/common';
import { StatesController } from './presentation/http/states.controller.js';
import { StatesService } from './application/states.service.js';
import { StatePrismaRepository } from './infrastructure/state-prisma.repository.js';

@Module({
    controllers: [
        StatesController,
    ],

    providers: [
        StatesService,

        {
            provide: STATE_REPOSITORY,
            useClass: StatePrismaRepository,
        },
    ],
})
export class StatesModule {}