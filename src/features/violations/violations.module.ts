import { Module } from '@nestjs/common';
import { ViolationTypesModule } from './violation-types/violation-types.module.js';

@Module({
    imports: [
        ViolationTypesModule,
    ],
})
    
export class ViolationModule {}