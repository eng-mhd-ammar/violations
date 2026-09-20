import { Objection } from './objection.model.js';
import type { ObjectionAttributes } from './objection.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const OBJECTION_REPOSITORY = Symbol('OBJECTION_REPOSITORY');

export abstract class ObjectionRepository {
    abstract create(objection: Objection): Promise<Objection>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Objection | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Objection | null>;

    abstract first(options?: QueryOptions): Promise<Objection | null>;

    abstract update(id: number, data: Partial<ObjectionAttributes>): Promise<Objection>;

    abstract delete(id: number): Promise<Objection>;

    abstract restore(id: number): Promise<Objection>;

    abstract forceDelete(id: number): Promise<Objection>;
}