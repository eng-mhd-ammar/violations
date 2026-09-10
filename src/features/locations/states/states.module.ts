import { Module } from '@nestjs/common';
import { StatesController } from './presentation/http/states.controller.js';
import { StatesService } from './application/states.service.js';
import { StatePrismaRepository } from './infrastructure/state-prisma.repository.js';
import { StateRepository } from './domain/state.repository.js';

@Module({
    controllers: [
        StatesController,
    ],

    providers: [
        StatesService,

        {
            provide: StateRepository,
            useClass: StatePrismaRepository,
        },
    ],
})
export class StatesModule {}