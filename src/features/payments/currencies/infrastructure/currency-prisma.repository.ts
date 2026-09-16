import { Injectable } from '@nestjs/common';
import { Currency, type CurrencyAttributes } from '../domain/currency.model.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { CurrencyRepository } from '../domain/currency.repository.js';

@Injectable()
export class CurrencyPrismaRepository extends BaseRepository<Currency, CurrencyAttributes> implements CurrencyRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.Currency);
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'name',
            'code',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'name',
            'code',
            'phone',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'payments',
        ];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(currency: Currency): Promise<Currency> {
        const data = currency.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        const currencies =
            records.map(
                (record: CurrencyAttributes) =>
                    this.toDomain(record),
            );

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return currencies;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = currencies.length;

        const start = (page - 1) * perPage;

        const items =
            currencies.slice(
                start,
                start + perPage,
            );

        return {
            items,
            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage:
                    Math.ceil(
                        total / perPage,
                    ),
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<Currency | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Currency | null> {
        const builder = this.createQuery(options);

        const record =
            await builder
                .getQuery()
                .where({
                    id,
                })
                .first();
        
        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    async update(id: number, data: Partial<CurrencyAttributes>): Promise<Currency> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`Currency with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<Currency> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Currency with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<Currency> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Currency with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Currency> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Currency with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: CurrencyAttributes): Currency {
        return new Currency(data);
    }

    private toPrismaUpdateData(data: Partial<CurrencyAttributes>): Record<string, unknown> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.code !== undefined && {
                code: data.code,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}