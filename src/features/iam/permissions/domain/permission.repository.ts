import { Permission } from './permission.model.js';
import type { PermissionAttributes } from './permission.model.js';

import type {
    QueryOptions,
} from '../../../../core/database/repositories/query.types.js';


export const PERMISSION_REPOSITORY =
    Symbol('PERMISSION_REPOSITORY');

export abstract class PermissionRepository {

    abstract create(
        permission: Permission,
    ): Promise<Permission>;


    abstract all(
        options?: QueryOptions,
    ): Promise<any>;


    abstract find(
        id: number,
        options?: QueryOptions,
    ): Promise<Permission | null>;


    abstract findOneBy(
        conditions: Record<string, unknown>,
        options?: QueryOptions,
    ): Promise<Permission | null>;


    abstract first(
        options?: QueryOptions,
    ): Promise<Permission | null>;


    abstract update(
        id: number,
        data: Partial<PermissionAttributes>,
    ): Promise<Permission>;


    abstract delete(
        id: number,
    ): Promise<Permission>;


    abstract restore(
        id: number,
    ): Promise<Permission>;


    abstract forceDelete(
        id: number,
    ): Promise<Permission>;
}