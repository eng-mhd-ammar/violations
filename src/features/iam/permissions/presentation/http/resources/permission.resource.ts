import { Permission } from '../../../domain/permission.model.js';

export interface PermissionResourceData {
    id: number | undefined;
    name: string;
    slug: string;
    description: string | null;
}

export class PermissionResource {
    static make(permission: Permission, includes: string[] = []): PermissionResourceData {

        const resource: PermissionResourceData = {
            id: permission.id,
            name: permission.name,
            slug: permission.slug,
            description: permission.description,
        };

        return resource;
    }

    static collection(permissions: Permission[], includes: string[] = []): PermissionResourceData[] {
        return permissions.map(
            (permission) =>
                this.make(
                    permission,
                    includes,
                ),
        );
    }
}