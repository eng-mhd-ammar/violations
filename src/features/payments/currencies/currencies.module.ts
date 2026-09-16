import { CURRENCY_REPOSITORY } from './domain/currency.repository.js';
import { Module } from '@nestjs/common';
import { CurrenciesController } from './presentation/http/currencies.controller.js';
import { CurrenciesService } from './application/currencies.service.js';
import { CurrencyPrismaRepository } from './infrastructure/currency-prisma.repository.js';

@Module({
    controllers: [
        CurrenciesController,
    ],

    providers: [
        CurrenciesService,

        {
            provide: CURRENCY_REPOSITORY,
            useClass: CurrencyPrismaRepository,
        },
    ],
})

export class CurrenciesModule {}