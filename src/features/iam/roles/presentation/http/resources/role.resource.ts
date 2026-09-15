import { Role } from '../../../domain/role.model.js';

export interface RoleResourceData {
    id: number | undefined;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
}

export class RoleResource {
    static make(role: Role, includes: string[] = []): RoleResourceData {
        const resource: RoleResourceData = {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            isActive: role.isActive,
        };

        return resource;
    }

    static collection(roles: Role[], includes: string[] = []): RoleResourceData[] {
        return roles.map(
            (role) =>
                this.make(
                    role,
                    includes,
                ),
        );
    }
}