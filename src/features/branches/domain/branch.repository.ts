import { QueryOptions } from '../../../core/database/repositories/query.types.js';
import { Branch } from './branch.model.js';
import type { BranchAttributes } from './branch.model.js';

export const BRANCH_REPOSITORY = Symbol('BRANCH_REPOSITORY');

export abstract class BranchRepository {
    abstract create(branch: Branch): Promise<Branch>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Branch | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Branch | null>;

    abstract first(options?: QueryOptions): Promise<Branch | null>;

    abstract update(id: number, data: Partial<BranchAttributes>): Promise<Branch>;

    abstract delete(id: number): Promise<Branch>;

    abstract restore(id: number): Promise<Branch>;

    abstract forceDelete(id: number): Promise<Branch>;
}