import { Module } from '@nestjs/common';

import { StatesModule } from './states/states.module.js';
import { AddressesModule } from './addresses/addresses.module.js';

@Module({
    imports: [
        StatesModule,
        AddressesModule,
    ],
})
export class LocationModule {}