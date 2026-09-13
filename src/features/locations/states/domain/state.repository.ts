import type { PaginatedResult, QueryOptions } from '../../../../core/database/repositories/query.types.js';
import type { State } from './state.model.js';

export const STATE_REPOSITORY = Symbol('STATE_REPOSITORY');

export interface StateRepository {

    create(state: State): Promise<State>;

    all(options?: QueryOptions): Promise<PaginatedResult<State>>;

    first(options?: QueryOptions): Promise<State | null>;
    find(id: number, options?: QueryOptions): Promise<State | null>;

    update(id: number, data: Partial<{ name: string; }>): Promise<State>;

    delete(id: number): Promise<State>;

    restore(id: number): Promise<State>;

    forceDelete(id: number): Promise<State>;
}