import { Role } from '../../roles/domain/role.model.js';
import { User } from '../../users/domain/user.model.js';

export type UserRoleAttributes = {
    id?: number;

    userId?: number;
    roleId?: number;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    user?: User;
    role?: Role;
};

export class UserRole {

    private attributes: UserRoleAttributes;

    constructor(attributes: UserRoleAttributes) {
        this.attributes = {
            ...attributes,
        };
    }

    // ============================================================
    // Attributes
    // ============================================================

    get id(): number | undefined {
        return this.attributes.id;
    }

    get userId(): number | undefined {
        return this.attributes.userId;
    }

    get roleId(): number | undefined {
        return this.attributes.roleId;
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
    // Relations
    // ============================================================

    get user(): User | undefined {
        return this.attributes.user;
    }

    get role(): Role | undefined {
        return this.attributes.role;
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

    toArray(): UserRoleAttributes {
        return {
            ...this.attributes,
        };
    }
}