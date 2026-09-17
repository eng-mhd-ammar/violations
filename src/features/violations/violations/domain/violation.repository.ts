import { Violation } from './violation.model.js';
import type { ViolationAttributes } from './violation.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const VIOLATION_REPOSITORY = Symbol('VIOLATION_REPOSITORY');

export abstract class ViolationRepository {
    abstract create(violation: Violation): Promise<Violation>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Violation | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Violation | null>;

    abstract first(options?: QueryOptions): Promise<Violation | null>;

    abstract update(id: number, data: Partial<ViolationAttributes>): Promise<Violation>;

    abstract delete(id: number): Promise<Violation>;

    abstract restore(id: number): Promise<Violation>;

    abstract forceDelete(id: number): Promise<Violation>;
}