import { Module } from '@nestjs/common';
import { ViolationTypesModule } from './violation-types/violation-types.module.js';
import { ViolationsModule as ViolationRecordsModule } from './violations/violations.module.js';
import { ObjectionsModule } from './objections/objections.module.js';

@Module({
    imports: [
        ViolationTypesModule,
        ViolationRecordsModule,
        ObjectionsModule,
    ],
})
    
export class ViolationsModule {}