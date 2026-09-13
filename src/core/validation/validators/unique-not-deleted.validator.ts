import {
    Injectable,
} from '@nestjs/common';

import {
    ModuleRef,
} from '@nestjs/core';

import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import {
    PrismaService,
} from '../../database/prisma.service.js';

import {
    RouteResolver,
} from '../../http/helpers/route.helper.js';

@Injectable()
@ValidatorConstraint({
    name: 'UniqueNotDeleted',
    async: true,
})
export class UniqueNotDeletedValidator
    implements ValidatorConstraintInterface
{
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    async validate(
        value: unknown,
        args: ValidationArguments,
    ): Promise<boolean> {
        if (
            value === null ||
            value === undefined
        ) {
            return true;
        }

        const prisma =
            this.moduleRef.get(
                PrismaService,
                {
                    strict: false,
                },
            );

        const [
            model,
            columns,
            ignoreIdResolver,
        ] = args.constraints as [
            string,
            string | string[],
            RouteResolver | undefined,
        ];

        const ignoreId =
            ignoreIdResolver?.();

        const delegate =
            (prisma.db.orm.public as any)[model];

        if (!delegate) {
            throw new Error(
                `Prisma model "${model}" does not exist.`,
            );
        }

        const columnList =
            Array.isArray(columns)
                ? columns
                : [columns];

        const object =
            args.object as Record<string, unknown>;

        /*
         * Equality filters.
         */
        const equalityWhere:
            Record<string, unknown> = {
                deletedAt: null,
            };

        for (
            const column of columnList
        ) {
            const columnValue =
                column === args.property
                    ? value
                    : object[column];

            if (
                columnValue !== undefined &&
                columnValue !== null
            ) {
                equalityWhere[column] =
                    columnValue;
            }
        }

        /*
         * Build the query.
         *
         * Prisma 8 PostgreSQL ORM Client:
         * - object => equality
         * - callback => comparison operators
         * - neq() => not equal
         */
        let query =
            delegate.where(equalityWhere);

        if (
            ignoreId !== undefined &&
            ignoreId !== null &&
            ignoreId !== ''
        ) {
            const numericIgnoreId =
                Number(ignoreId);

            query =
                query.where(
                    (record: any) =>
                        record.id.neq(
                            numericIgnoreId,
                        ),
                );
        }

        const record =
            await query.first();

        return record === null;
    }

    defaultMessage(
        args: ValidationArguments,
    ): string {
        return `The ${args.property} has already been taken (active record exists).`;
    }
}