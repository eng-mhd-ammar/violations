import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsValidator implements ValidatorConstraintInterface
{
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
        if (value === null || value === undefined) {
            return true;
        }

        const model = args.constraints[0] as string;
        const column = args.constraints[1] as string;
        const delegate = (this.prisma.db.orm.public as any)[ model ];

        if (!delegate) {
            throw new Error(`Prisma model "${model}" does not exist.`);
        }

        const record = await delegate.where({ [column]: value, deletedAt: null }).first();

        return record !== null;
    }

    defaultMessage(args: ValidationArguments): string {
        const column = args.constraints[1] as string;
        return `${column} does not exist.`;
    }
}