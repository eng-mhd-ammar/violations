import { Injectable } from '@nestjs/common';
import {ValidationArguments,ValidatorConstraint,ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
@ValidatorConstraint({ name: 'ExistsOrMinusOne', async: true })
export class ExistsOrMinusOneValidator implements ValidatorConstraintInterface
{
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
        if (value === null || value === undefined) {
            return true;
        }

        // -1 is a valid special value.
        if (value === -1) {
            return true;
        }

        const model = args.constraints[0] as string;
        const column = args.constraints[1] as string;

        const delegate =
            (this.prisma.db.orm.public as any)[model];

        if (!delegate) {
            throw new Error(
                `Prisma model "${model}" does not exist.`,
            );
        }

        const record = await delegate
            .where({
                [column]: value,
                deletedAt: null,
            })
            .first();

        return record !== null;
    }

    defaultMessage(args: ValidationArguments): string {
        const column = args.constraints[1] as string;
        return `${column} must exist or be -1.`;
    }
}