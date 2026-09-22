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

            if (
                value === undefined ||
                value === null ||
                value === ''
            ) {
                continue;
            }

            this.query = this.query.where({
                [column]: value,
            });

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

            this.query = this.applyNestedInclude(this.query, include);
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

        if (nestedRelations.length === 0) {
            return query.include(
                relation,
            );
        }

        return query.include(
            relation,
            (relationQuery: any) =>
                this.buildNestedInclude(
                    relationQuery,
                    nestedRelations,
                ),
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