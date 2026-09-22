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

            if (column.includes('.')) {
                this.query =
                    this.applyNestedFilter(
                        this.query,
                        column,
                        value,
                    );

                continue;
            }

            this.query =
                this.applySimpleFilter(
                    this.query,
                    column,
                    value,
                );
        }

        return this;
    }

    protected applySimpleFilter(query: any, column: string, value: unknown): any {
        const values = this.normalizeFilterValues(value);

        if (values.length === 1) {
            return query.where({
                [column]: values[0],
            });
        }

        return query.where(
            (record: any) =>
                record[column].in(values),
        );
    }

    protected applyNestedFilter(query: any, path: string, value: unknown): any {
        const relations = path.split('.');
        const values = this.normalizeFilterValues(value);

        return query.where(
            (record: any) =>
                this.buildNestedFilter(
                    record,
                    relations,
                    values,
                ),
        );
    }

    protected buildNestedFilter(record: any, relations: string[], values: unknown[]): any {
        const [
            relation,
            ...remaining
        ] = relations;

        if (!relation) {

            return undefined;
        }

        if (remaining.length === 1) {
            const column = remaining[0];

            if (values.length === 1) {
                return record[relation].some(
                    (item: any) =>
                        item[column].eq(
                            values[0],
                        ),
                );
            }

            return record[relation].some(
                (item: any) =>
                    item[column].in(
                        values,
                    ),
            );
        }

        return record[relation].some(
            (item: any) =>
                this.buildNestedFilter(
                    item,
                    remaining,
                    values,
                ),
        );
    }

    protected normalizeFilterValues(value: unknown): unknown[] {
        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === 'string' && value.includes(',')) {
            return value
                .split(',')
                .map(
                    item => item.trim(),
                )
                .filter(
                    item => item !== '',
                );
        }

        return [value];
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

            const column = descending
                ? sort.substring(1)
                : sort;

            if (!allowedSorts.includes(column)) {
                continue;
            }

            this.applyOrderBy(
                column,
                descending,
            );

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
            if (!this.isAllowedInclude(include, allowedIncludes)) {
                continue;
            }

            this.query = this.applyNestedInclude(
                this.query,
                include,
            );
        }

        return this;
    }

    // ============================================================
    // Include Validation
    // ============================================================

    protected isAllowedInclude(include: string, allowedIncludes: string[]): boolean {
        return allowedIncludes.some(
            allowed =>
                allowed === include ||
                allowed.startsWith(
                    `${include}.`,
                ) ||
                include.startsWith(
                    `${allowed}.`,
                ),
        );
    }

    // ============================================================
    // Nested Includes
    // ============================================================

    protected applyNestedInclude(query: any, include: string): any {
        const relations = include.split('.');

        return this.buildNestedInclude(query, relations);
    }

    protected buildNestedInclude(query: any, relations: string[]): any {
        const [
            relation,
            ...nestedRelations
        ] = relations;

        if (!relation) {
            return query;
        }

        return query.include(
            relation,
            (relationQuery: any) => {
                const filteredQuery =
                    relationQuery.where({
                        deletedAt: null,
                    });

                if (nestedRelations.length === 0) {
                    return filteredQuery;
                }

                return this.buildNestedInclude(
                    filteredQuery,
                    nestedRelations,
                );
            },
        );
    }

    // ============================================================
    // Soft Deletes
    // ============================================================

    applySoftDeletes(options: QueryOptions): this {
        const trashed = options.trashed ?? 'not';

        if (trashed === 'not') {
            this.query = this.query.where({ deletedAt: null });
            return this;
        }

        if (trashed === 'only') {
            this.query = this.query.where((record: any) => record.deletedAt.isNotNull());
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