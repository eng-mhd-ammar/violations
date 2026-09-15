import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma.module.js';

import { ExistsValidator } from './validators/exists.validator.js';
import { UniqueValidator } from './validators/unique.validator.js';
import { UniqueNotDeletedValidator } from './validators/unique-not-deleted.validator.js';
import { NotSoftDeletedValidator } from './validators/not-soft-deleted.validator.js';
import { ExistsOrMinusOneValidator } from './validators/exists-or-minus-one.validator.js';

@Module({
    imports: [
        PrismaModule,
    ],

    providers: [
        ExistsValidator,
        UniqueValidator,
        UniqueNotDeletedValidator,
        NotSoftDeletedValidator,
        ExistsOrMinusOneValidator,
    ],

    exports: [
        ExistsValidator,
        UniqueValidator,
        UniqueNotDeletedValidator,
        NotSoftDeletedValidator,
        ExistsOrMinusOneValidator,
    ],
})
    
export class ValidationModule {}