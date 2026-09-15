import type { QueryOptions } from './query.types.js';

export class BaseQueryBuilder {
    protected query: any;

    constructor(protected readonly model: any) {
        this.query = model;
    }

    // ============================================================
    // Filters
    // ============================================================

    applyFilters(options: QueryOptions): this {
        const filters = options.filter ?? {};

        for (const [column, value] of Object.entries(filters)) {
            if (value === undefined || value === null || value === '') {
                continue;
            }

            this.query = this.query.where({ [column]: value });
        }

        return this;
    }

    // ============================================================
    // Sorting
    // ============================================================

    applySort(options: QueryOptions, allowedSorts: string[], defaultSort: string[] = []): this {
        const sorts =
            options.sort &&
            options.sort.length > 0
                ? options.sort
                : defaultSort;

        for (const sort of sorts) {
            const descending = sort.startsWith('-');

            const column = descending? sort.substring(1): sort;

            if (!allowedSorts.includes(column)) {
                continue;
            }

            this.applyOrderBy(column, descending);
        }

        return this;
    }

    protected applyOrderBy(column: string, descending: boolean): void {
        this.query =
            this.query.orderBy(
                (record: any) =>
                    descending
                        ? record[column].desc()
                        : record[column].asc(),
            );
    }

    // ============================================================
    // Includes
    // ============================================================

    applyIncludes(options: QueryOptions, allowedIncludes: string[]): this {

        const includes = options.include ?? [];

        for (const include of includes) {
            if (!allowedIncludes.includes(include,)) {
                continue;
            }

            this.query = this.query.include(include);
        }

        return this;
    }

    // ============================================================
    // Soft Deletes
    // ============================================================

    applySoftDeletes(options: QueryOptions): this {

        const trashed = options.trashed ?? 'not';

        if (trashed === 'not') {
            this.query =
                this.query.where({
                    deletedAt: null,
                });
            
            return this;
        }

        if (trashed === 'only') {
            this.query =
                this.query.where(
                    (record: any) =>
                        record.deletedAt.isNotNull(),
                );
            
            return this;
        }

        return this;
    }

    // ============================================================
    // Query
    // ============================================================

    getQuery(): any {
        return this.query;
    }

    async all(): Promise<any[]> {
        return this.query.all();
    }

    async first(): Promise<any | null> {
        return this.query.first();
    }
}