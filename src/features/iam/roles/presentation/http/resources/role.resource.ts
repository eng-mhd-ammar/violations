import { Role } from '../../../domain/role.model.js';

export class RoleResource {
    static make(role: Role) {
        return {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description,
            isActive: role.isActive,
        };
    }

    static collection(roles: Role[]) {
        return roles.map((role) => this.make(role));
    }
}
