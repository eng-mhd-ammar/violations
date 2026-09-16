import { Citizen } from './citizen.model.js';
import type { CitizenAttributes } from './citizen.model.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';

export const CITIZEN_REPOSITORY = Symbol('CITIZEN_REPOSITORY');

export abstract class CitizenRepository {
    abstract create(citizen: Citizen): Promise<Citizen>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Citizen | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Citizen | null>;

    abstract first(options?: QueryOptions): Promise<Citizen | null>;

    abstract update(id: number, data: Partial<CitizenAttributes>): Promise<Citizen>;

    abstract delete(id: number): Promise<Citizen>;

    abstract restore(id: number): Promise<Citizen>;

    abstract forceDelete(id: number): Promise<Citizen>;
}