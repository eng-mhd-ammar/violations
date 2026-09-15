import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface
{
    constructor(private readonly prisma: PrismaService) {}

    async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
        if (value === null || value === undefined) {
            return true;
        }

        const [
            model,
            columns,
            ignoreId,
        ] = args.constraints as [
            string,
            string | string[],
            string | number | undefined,
        ];

        const modelDelegate =
            (this.prisma.db.orm.public as any)[
                model
            ];

        if (!modelDelegate) {
            throw new Error(`Prisma model "${model}" does not exist.`);
        }

        const columnList = Array.isArray(columns)
            ? columns
            : [columns];

        const object = args.object as Record<string, unknown>;

        const where: Record<string, unknown> = { deletedAt: null };

        for (const column of columnList) {
            const columnValue =
                column === args.property
                    ? value
                    : object[column];

            if (columnValue !== undefined && columnValue !== null) {
                where[column] = columnValue;
            }
        }
        
        if (ignoreId !== undefined && ignoreId !== null) {
            where.id = {
                not: ignoreId,
            };
        }

        const record = await modelDelegate.where(where).first();

        return record === null;
    }

    defaultMessage(args: ValidationArguments): string {
        return `The ${args.property} has already been taken (active record exists).`;
    }
}