import { RolePermission } from './role-permission.model.js';
import type { RolePermissionAttributes } from './role-permission.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const ROLE_PERMISSION_REPOSITORY = Symbol('ROLE_PERMISSION_REPOSITORY');

export abstract class RolePermissionRepository {
    abstract create(permission: RolePermission): Promise<RolePermission>;
    
    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<RolePermission | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<RolePermission | null>;

    abstract first(options?: QueryOptions): Promise<RolePermission | null>;

    abstract update(id: number, data: Partial<RolePermissionAttributes>): Promise<RolePermission>;

    abstract delete(id: number): Promise<RolePermission>;

    abstract restore(id: number): Promise<RolePermission>;

    abstract forceDelete(id: number): Promise<RolePermission>;
}