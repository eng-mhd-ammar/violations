import { RolePermission, RolePermissionAttributes } from "./user-role.model";


export abstract class RolePermissionRepository {
    abstract create(
        rolePermission: RolePermission,
    ): Promise<RolePermission>;

    abstract findAll(): Promise<RolePermission[]>;

    abstract findById(
        id: number,
    ): Promise<RolePermission | null>;

    abstract findByIdIncludingDeleted(
        id: number,
    ): Promise<RolePermission | null>;

    abstract update(
        id: number,
        data: Partial<RolePermissionAttributes>,
    ): Promise<RolePermission>;

    abstract delete(
        id: number,
    ): Promise<RolePermission>;

    abstract restore(
        id: number,
    ): Promise<RolePermission>;

    abstract forceDelete(
        id: number,
    ): Promise<RolePermission>;
}