import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { State, StateAttributes } from './state.model.js';

export abstract class StateRepository {
    abstract all(options?: QueryOptions): Promise<State[]>;

    abstract first(options?: QueryOptions): Promise<State | null>;

    abstract find(id: number, options?: QueryOptions): Promise<State | null>;

    abstract create(state: State): Promise<State>;

    abstract update(id: number, data: Partial<StateAttributes>): Promise<State>;

    abstract delete(id: number): Promise<State>;

    abstract restore(id: number): Promise<State>;

    abstract forceDelete(id: number): Promise<State>;
}