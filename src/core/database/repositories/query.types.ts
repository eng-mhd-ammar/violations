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

    trashed?: TrashedMode;
}