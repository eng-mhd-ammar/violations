export type TrashedMode =
    | 'not'
    | 'with'
    | 'only';

export interface QueryOptions {
    filter?: Record<string, unknown>;

    sort?: string[];

    include?: string[];

    fields?: string[];

    search?: string;

    page?: number;

    perPage?: number;

    paginate?: boolean;

    trashed?: TrashedMode;
}

export interface PaginationMeta {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
}

export interface PaginatedResult<T> {
    items: T[];

    pagination: PaginationMeta;
}