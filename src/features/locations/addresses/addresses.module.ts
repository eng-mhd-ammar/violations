import { ADDRESS_REPOSITORY } from './domain/address.repository.js';
import { Module } from '@nestjs/common';
import { AddressesController } from './presentation/http/addresses.controller.js';
import { AddressesService } from './application/addresses.service.js';
import { AddressPrismaRepository } from './infrastructure/address-prisma.repository.js';

@Module({
    controllers: [
        AddressesController,
    ],

    providers: [
        AddressesService,

        {
            provide: ADDRESS_REPOSITORY,
            useClass: AddressPrismaRepository,
        },
    ],
})
export class AddressesModule {}