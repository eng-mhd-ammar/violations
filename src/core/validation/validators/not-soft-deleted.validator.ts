import { Injectable } from '@nestjs/common';

import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
@ValidatorConstraint({ name: 'NotSoftDeleted', async: true })
export class NotSoftDeletedValidator implements ValidatorConstraintInterface
{
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
        if (!value) {
            return true;
        }

        const [model] =
            args.constraints as [string];

        const delegate =
            (this.prisma.db.orm.public as any)[
                model
            ];

        if (!delegate) {
            throw new Error(
                `Prisma model "${model}" does not exist.`,
            );
        }

        const record =
            await delegate
                .where({
                    id: value,
                    deletedAt: null,
                })
                .first();

        return record !== null;
    }

    defaultMessage(
        args: ValidationArguments,
    ): string {
        return `The requested ${args.property} has been deleted.`;
    }
}