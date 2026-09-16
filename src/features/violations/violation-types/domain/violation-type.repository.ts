import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { ViolationType } from './violation-type.model.js';
import type { ViolationTypeAttributes } from './violation-type.model.js';

export const VIOLATION_TYPE_REPOSITORY = Symbol('VIOLATION_TYPE_REPOSITORY');

export abstract class ViolationTypeRepository {
    abstract create(violationType: ViolationType): Promise<ViolationType>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<ViolationType | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<ViolationType | null>;

    abstract first(options?: QueryOptions): Promise<ViolationType | null>;

    abstract update(id: number, data: Partial<ViolationTypeAttributes>): Promise<ViolationType>;

    abstract delete(id: number): Promise<ViolationType>;

    abstract restore(id: number): Promise<ViolationType>;

    abstract forceDelete(id: number): Promise<ViolationType>;
}