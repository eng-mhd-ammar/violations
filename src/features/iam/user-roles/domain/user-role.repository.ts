import {
    UserRole,
    UserRoleAttributes,
} from './user-role.model.js';

export abstract class UserRoleRepository {
    abstract create(
        userRole: UserRole,
    ): Promise<UserRole>;

    abstract findAll(): Promise<UserRole[]>;

    abstract findById(
        id: number,
    ): Promise<UserRole | null>;

    abstract findByIdIncludingDeleted(
        id: number,
    ): Promise<UserRole | null>;

    abstract update(
        id: number,
        data: Partial<UserRoleAttributes>,
    ): Promise<UserRole>;

    abstract delete(
        id: number,
    ): Promise<UserRole>;

    abstract restore(
        id: number,
    ): Promise<UserRole>;

    abstract forceDelete(
        id: number,
    ): Promise<UserRole>;
}