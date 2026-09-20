import { Module } from '@nestjs/common';
import { ViolationTypesModule } from './violation-types/violation-types.module.js';
import { ViolationsModule as ViolationRecordsModule } from './violations/violations.module.js';

@Module({
    imports: [
        ViolationTypesModule,
        ViolationRecordsModule,
    ],
})
    
export class ViolationsModule {}