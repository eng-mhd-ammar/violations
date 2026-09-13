import { BaseQueryBuilder } from './base-query-builder.js';
import type { QueryOptions } from './query.types.js';

export abstract class BaseRepository<TDomain, TAttributes> {

    protected readonly model: any;

    constructor(model: any) {
        this.model = model;
    }

    protected abstract toDomain(data: TAttributes): TDomain;

    // ============================================================
    // Configuration
    // ============================================================

    protected allowedSorts(): string[] {
        return [];
    }

    protected allowedFilters(): string[] {
        return [];
    }

    protected allowedIncludes(): string[] {
        return [];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [];
    }

    // ============================================================
    // Query Builder
    // ============================================================

    protected createQuery(options: QueryOptions = {}): BaseQueryBuilder {
        console.log('QUERY OPTIONS:', options);

        const filteredOptions = this.filterAllowedFilters(options);

        const builder = new BaseQueryBuilder(this.model);

        builder.applySoftDeletes(filteredOptions);

        builder.applyFilters(filteredOptions);

        builder.applySort(filteredOptions, this.allowedSorts(), this.defaultSort());

        builder.applyIncludes( filteredOptions, this.allowedIncludes());

        return builder;
    }

    // ============================================================
    // Allowed Filters
    // ============================================================

    protected filterAllowedFilters(options: QueryOptions): QueryOptions {

        if (!options.filter) {
            return options;
        }

        const allowed = this.allowedFilters();

        const filter: Record<string, unknown> = {};

        for (
            const [key, value]
            of Object.entries(
                options.filter,
            )
        ) {
            if (
                allowed.includes(key)
            ) {
                filter[key] = value;
            }
        }

        return {
            ...options,
            filter,
        };
    }

    // ============================================================
    // All
    // ============================================================

    async all(options: QueryOptions = {}): Promise<TDomain[]> {
        const records = await this.createQuery(options).all();

        return records.map(
            (record: TAttributes) =>
                this.toDomain(record),
        );
    }

    // ============================================================
    // First
    // ============================================================

    async first(options: QueryOptions = {}): Promise<TDomain | null> {
        const record = await this.createQuery(options).first();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    // ============================================================
    // Find
    // ============================================================

    async find(id: number, options: QueryOptions = {}): Promise<TDomain | null> {
        const query = this.createQuery(options);

        const record = await query.getQuery().where({ id }).first();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    // ============================================================
    // Create
    // ============================================================

    protected async createRecord(data: Record<string, unknown>): Promise<TDomain> {
        const record = await this.model.create(data);

        return this.toDomain(record);
    }

    // ============================================================
    // Update
    // ============================================================

    protected async updateRecord(id: number, data: Record<string, unknown>): Promise<TDomain | null> {
        const record = await this.model.where({ id, deletedAt: null }).update(data);

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    // ============================================================
    // Soft Delete
    // ============================================================

    protected async softDeleteRecord(id: number): Promise<TDomain | null> {
        const record = await this.model.where({ id, deletedAt: null }).update({ deletedAt: new Date().toISOString() });

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    // ============================================================
    // Restore
    // ============================================================

    protected async restoreRecord(id: number): Promise<TDomain | null> {
        const record = await this.model.where({ id }).update({ deletedAt: null });

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    // ============================================================
    // Force Delete
    // ============================================================

    protected async forceDeleteRecord(id: number): Promise<TDomain | null> {
        const record = await this.model.where({ id }).delete();

        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }
}