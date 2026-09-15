import { UserRole } from './user-role.model.js';
import type { UserRoleAttributes } from './user-role.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const USER_ROLE_REPOSITORY = Symbol('USER_ROLE_REPOSITORY');

export abstract class UserRoleRepository {
    abstract create(permission: UserRole): Promise<UserRole>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<UserRole | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<UserRole | null>;

    abstract first(options?: QueryOptions): Promise<UserRole | null>;

    abstract update(id: number, data: Partial<UserRoleAttributes>): Promise<UserRole>;

    abstract delete(id: number): Promise<UserRole>;

    abstract restore(id: number): Promise<UserRole>;

    abstract forceDelete(id: number): Promise<UserRole>;

    abstract sync(roleId: number, permissionIds: number[]): Promise<void>;

    abstract findByRoleId(roleId: number, options?: QueryOptions): Promise<UserRole[]>;

    abstract findByUserId(userId: number, options?: QueryOptions): Promise<UserRole[]>;
}