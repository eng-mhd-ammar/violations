import { Role, RoleAttributes } from './role.model.js';

export abstract class RoleRepository {
    abstract create(role: Role): Promise<Role>;

    abstract findAll(): Promise<Role[]>;

    abstract findById(id: number): Promise<Role | null>;

    abstract findByIdIncludingDeleted(
        id: number,
    ): Promise<Role | null>;

    abstract findBySlug(
        slug: string,
    ): Promise<Role | null>;

    abstract update(
        id: number,
        data: Partial<RoleAttributes>,
    ): Promise<Role>;

    abstract delete(id: number): Promise<Role>;

    abstract restore(id: number): Promise<Role>;

    abstract forceDelete(id: number): Promise<Role>;
}
