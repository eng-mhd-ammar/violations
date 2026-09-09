import { Role } from '../../roles/domain/role.model.js';
import { Permission } from '../../permissions/domain/permission.model.js';

export interface RolePermissionAttributes {

    id?: number;

    roleId: number;

    permissionId: number;

    role?: Role;

    permission?: Permission;

    createdAt?: string;

    updatedAt?: string;

    deletedAt?: string | null;
}

export class RolePermission {

    private readonly attributes: RolePermissionAttributes;

    constructor(attributes: RolePermissionAttributes) {

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

    get roleId(): number {
        return this.attributes.roleId;
    }

    get permissionId(): number {
        return this.attributes.permissionId;
    }

    get role(): Role | undefined {
        return this.attributes.role;
    }

    get permission(): Permission | undefined {
        return this.attributes.permission;
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

    changeRole(roleId: number): void {

        this.attributes.roleId = roleId;

    }

    changePermission(permissionId: number): void {

        this.attributes.permissionId = permissionId;

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
}