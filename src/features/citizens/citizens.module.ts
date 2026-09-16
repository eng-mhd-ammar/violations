import { CITIZEN_REPOSITORY } from './domain/citizen.repository.js';
import { Module } from '@nestjs/common';
import { CitizensController } from './presentation/http/citizens.controller.js';
import { CitizensService } from './application/citizens.service.js';
import { CitizenPrismaRepository } from './infrastructure/citizen-prisma.repository.js';

@Module({
    controllers: [
        CitizensController,
    ],

    providers: [
        CitizensService,

        {
            provide: CITIZEN_REPOSITORY,
            useClass: CitizenPrismaRepository,
        },
    ],
})
    
export class CitizensModule {}