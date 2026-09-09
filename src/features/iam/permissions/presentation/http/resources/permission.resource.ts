import { Permission } from '../../../domain/permission.model.js';

export class PermissionResource {
    static make(permission: Permission) {
        return {
            id: permission.id,
            name: permission.name,
            slug: permission.slug,
            description: permission.description,
        };
    }

    static collection(permissions: Permission[]) {
        return permissions.map((permission) => this.make(permission));
    }
}