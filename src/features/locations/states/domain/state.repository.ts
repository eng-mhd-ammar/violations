import { State } from './state.model.js';
import type { StateAttributes } from './state.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const STATE_REPOSITORY = Symbol('STATE_REPOSITORY');

export abstract class StateRepository {
    abstract create(state: State): Promise<State>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<State | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<State | null>;

    abstract first(options?: QueryOptions): Promise<State | null>;

    abstract update(id: number, data: Partial<StateAttributes>): Promise<State>;

    abstract delete(id: number): Promise<State>;

    abstract restore(id: number): Promise<State>;

    abstract forceDelete(id: number): Promise<State>;
}