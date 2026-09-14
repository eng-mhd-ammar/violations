import { Permission } from '../../permissions/domain/permission.model.js';
import { UserRole } from '../../user-roles/domain/user-role.model.js';

export type RoleAttributes = {

    id?: number;

    name: string;

    slug: string;

    description?: string | null;

    isActive?: boolean;

    createdAt?: string;

    updatedAt?: string;

    deletedAt?: string | null;

    permissions?: Permission[];

    userRoles?: UserRole[];

}


export class Role {

    private attributes: RoleAttributes;

    constructor(attributes: RoleAttributes) {

        this.attributes = {

            description: null,

            isActive: true,

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

    get name(): string {

        return this.attributes.name;

    }

    get slug(): string {

        return this.attributes.slug;

    }

    get description(): string | null {

        return this.attributes.description ?? null;

    }

    get isActive(): boolean {

        return this.attributes.isActive ?? true;

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

    get permissions(): Permission[] {

        return this.attributes.permissions ?? [];

    }

    get userRoles(): UserRole[] {

        return this.attributes.userRoles ?? [];

    }


    // ============================================================
    // Mutations
    // ============================================================

    changeName(name: string): void {

        this.attributes.name = name;

    }

    changeSlug(slug: string): void {

        this.attributes.slug = slug;

    }

    changeDescription(
        description: string | null,
    ): void {

        this.attributes.description = description;

    }

    activate(): void {

        this.attributes.isActive = true;

    }

    deactivate(): void {

        this.attributes.isActive = false;

    }


    // ============================================================
    // State
    // ============================================================

    isDeleted(): boolean {

        return this.deletedAt !== null;

    }

    isActiveRole(): boolean {

        return this.isActive;

    }


    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): RoleAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): RoleAttributes {
        return {
            ...this.attributes,
        };
    }
}