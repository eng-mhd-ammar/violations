import { BaseQueryBuilder } from './base-query-builder.js';
import type { PaginatedResult, QueryOptions } from './query.types.js';

export type AllowedFilter =
    | string
    | {
        path: string;
        alias: string;
    };

export type AllowedInclude =
    | string
    | {
        path: string;
        alias: string;
    };

export abstract class BaseRepository<TDomain, TAttributes> {
    protected readonly model: any;

    constructor(model: any) {
        this.model = model;
    }

    protected abstract toDomain(data: TAttributes): TDomain;

    protected allowedSorts(): string[] {
        return [];
    }

    protected allowedFilters(): AllowedFilter[] {
        return [];
    }

    protected allowedIncludes(): AllowedInclude[] {
        return [];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt'
        ];
    }

    protected createQuery(options: QueryOptions = {}): BaseQueryBuilder {
        const filteredOptions = this.filterAllowedFilters(options);

        const normalizedOptions = this.normalizeIncludes(filteredOptions);

        const builder = new BaseQueryBuilder(this.model);

        builder.applySoftDeletes(normalizedOptions);

        builder.applyFilters(normalizedOptions);

        builder.applySort(normalizedOptions, this.allowedSorts(), this.defaultSort());

        builder.applyIncludes(
            normalizedOptions,
            this.allowedIncludes().map(
                item =>
                    typeof item === 'string'
                        ? item
                        : item.path,
            ),
        );

        return builder;
    }

    protected normalizeIncludes(options: QueryOptions): QueryOptions {
        if (!options.include) {
            return options;
        }

        const allowed = this.allowedIncludes();

        const includes: string[] = [];

        for (const include of options.include) {
            const includeDefinition =
                allowed.find(
                    item => {
                        if (typeof item === 'string') {
                            return (
                                item === include
                            );
                        }
                        return (
                            item.path === include ||
                            item.alias === include
                        );
                    },
                );

            if (!includeDefinition) {
                continue;
            }

            const path =
                typeof includeDefinition === 'string'
                    ? includeDefinition
                    : includeDefinition.path;

            includes.push(path);
        }

        return {
            ...options,
            include: includes,
        };
    }

    protected filterAllowedFilters(options: QueryOptions): QueryOptions {
        if (!options.filter) {
            return options;
        }

        const allowed = this.allowedFilters();

        const filter: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(options.filter)) {
            const filterDefinition =
                allowed.find(
                    item => {

                        if (
                            typeof item === 'string'
                        ) {
                            return item === key;
                        }

                        return (
                            item.path === key ||
                            item.alias === key
                        );
                    },
                );

            if (!filterDefinition) {
                continue;
            }

            const path =
                typeof filterDefinition === 'string'
                    ? filterDefinition
                    : filterDefinition.path;

            filter[path] = value;
        }

        return {
            ...options,
            filter,
        };
    }

    async all(options: QueryOptions = {}): Promise<PaginatedResult<TDomain>> {
        const records = await this.createQuery(options).all();

        const domains =
            records.map(
                (record: TAttributes) =>
                    this.toDomain(record),
            );

        /*
         * ============================
         * WITHOUT PAGINATION
         * ============================
         */

        if (options.paginate === false) {
            return {
                items: domains,

                pagination: {
                    currentPage: 1,
                    perPage: domains.length,
                    total: domains.length,
                    lastPage: 1,
                },
            };
        }

        /*
         * ============================
         * PAGINATION
         * ============================
         */

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = domains.length;

        const lastPage = Math.ceil(total / perPage);

        const start = (page - 1) * perPage;

        const items =
            domains.slice(
                start,
                start + perPage,
            );

        return {
            items,

            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage,
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<TDomain | null> {
        const record = await this.createQuery(options).first();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    async find(id: number, options: QueryOptions = {}): Promise<TDomain | null> {
        const query = this.createQuery(options);

        const record =
            await query
                .getQuery()
                .where({ id })
                .first();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }
    
    async findOneBy(
        conditions: Record<string, unknown>, options: QueryOptions = {}): Promise<TDomain | null> {
    
        const query = this.createQuery(options);
    
        const record = await query
            .getQuery()
            .where(conditions)
            .first();
    
        if (!record) {
            return null;
        }
    
        return this.toDomain(record);
    }

    protected async createRecord(data: Record<string, unknown>): Promise<TDomain> {
        const record =
            await this.model.create(data);

        return this.toDomain(record);
    }

    protected async updateRecord(id: number, data: Record<string, unknown>): Promise<TDomain | null> {
        const record =
            await this.model
                .where({
                    id,
                    deletedAt: null,
                })
                .update(data);

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    protected async softDeleteRecord(id: number): Promise<TDomain | null> {
        const record =
            await this.model
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt:
                        new Date().toISOString(),
                });

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    protected async restoreRecord(id: number): Promise<TDomain | null> {
        const record =
            await this.model
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    protected async forceDeleteRecord(id: number): Promise<TDomain | null> {
        const record = await this.model.where({ id }).delete();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }
}