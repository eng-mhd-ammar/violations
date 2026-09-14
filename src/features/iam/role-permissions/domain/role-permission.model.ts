import { Permission } from '../../permissions/domain/permission.model.js';
import { Role } from '../../roles/domain/role.model.js';

export type RolePermissionAttributes = {
    id?: number;

    permissionId?: number;
    roleId?: number;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    permission?: Permission;
    role?: Role;
};

export class RolePermission {

    private attributes: RolePermissionAttributes;

    constructor(attributes: RolePermissionAttributes) {
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

    get permissionId(): number | undefined {
        return this.attributes.permissionId;
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

    get permission(): Permission | undefined {
        return this.attributes.permission;
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

    toAttributes(): RolePermissionAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): RolePermissionAttributes {
        return {
            ...this.attributes,
        };
    }
}