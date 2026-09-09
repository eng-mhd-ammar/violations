import { User } from '../../users/domain/user.model.js';
import { Role } from '../../roles/domain/role.model.js';

export interface UserRoleAttributes {

    id?: number;

    userId: number;

    roleId: number;

    user?: User;

    role?: Role;

    createdAt?: string;

    updatedAt?: string;

    deletedAt?: string | null;
}

export class UserRole {

    private readonly attributes: UserRoleAttributes;

    constructor(attributes: UserRoleAttributes) {

        this.attributes = {
            deletedAt: null,
            ...attributes,
        };
    }

    // ============================================================
    // Attributes
    // ============================================================

    get id(): number | undefined {
        return this.attributes.id;
    }

    get userId(): number {
        return this.attributes.userId;
    }

    get roleId(): number {
        return this.attributes.roleId;
    }

    get user(): User | undefined {
        return this.attributes.user;
    }

    get role(): Role | undefined {
        return this.attributes.role;
    }

    get createdAt(): string | undefined {
        return this.attributes.createdAt;
    }

    get updatedAt(): string | undefined {
        return this.attributes.updatedAt;
    }

    get deletedAt(): string | null {
        return this.attributes.deletedAt ?? null;
    }

    // ============================================================
    // Mutations
    // ============================================================

    changeUser(userId: number): void {
        this.attributes.userId = userId;
    }

    changeRole(roleId: number): void {
        this.attributes.roleId = roleId;
    }

    // ============================================================
    // State
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): UserRoleAttributes {
        return {
            ...this.attributes,
        };
    }
}