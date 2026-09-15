import { Role } from './role.model.js';
import type { RoleAttributes } from './role.model.js';
import type { QueryOptions} from '../../../../core/database/repositories/query.types.js';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export abstract class RoleRepository {
    abstract create(Role: Role): Promise<Role>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Role | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Role | null>;

    abstract first(options?: QueryOptions): Promise<Role | null>;

    abstract update(id: number, data: Partial<RoleAttributes>): Promise<Role>;

    abstract delete(id: number): Promise<Role>;

    abstract restore(id: number): Promise<Role>;

    abstract forceDelete(id: number): Promise<Role>;
}