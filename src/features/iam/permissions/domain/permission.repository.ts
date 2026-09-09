import { Permission, PermissionAttributes } from "./permission.model";


export abstract class PermissionRepository {
    abstract create(permission: Permission): Promise<Permission>;

    abstract findAll(): Promise<Permission[]>;

    abstract findById(id: number): Promise<Permission | null>;

    abstract findByIdIncludingDeleted(id: number): Promise<Permission | null>;

    abstract findBySlug(slug: string): Promise<Permission | null>;

    abstract update(id: number, data: Partial<PermissionAttributes>): Promise<Permission>;

    abstract delete(id: number): Promise<Permission>;

    abstract restore(id: number): Promise<Permission>;

    abstract forceDelete(id: number): Promise<Permission>;
}