import { Permission } from '../../../../permissions/domain/permission.model.js';

import { PermissionResource } from '../../../../permissions/presentation/http/resources/permission.resource.js';

import { Role } from '../../../domain/role.model.js';

export interface RoleResourceData {
    id: number | undefined;

    name: string;
    slug: string;
    description: string | null;

    isActive: boolean;

    permissions?: ReturnType<typeof PermissionResource.make>[];
}

export class RoleResource {
    static make(role: Role): RoleResourceData {

        const resource: RoleResourceData = {
            id: role.id,

            name: role.name,
            slug: role.slug,
            description: role.description,

            isActive: role.isActive,
        };

        if (role.rolePermissions.length > 0) {
            resource.permissions =
                PermissionResource.collection(
                    role.rolePermissions
                        .map(
                            rolePermission =>
                                rolePermission.permission,
                        )
                        .filter(
                            (
                                permission,
                            ): permission is Permission =>
                                permission !== undefined,
                        ),
                );
        }

        return resource;
    }

    static collection(roles: Role[]): RoleResourceData[] {
        return roles.map(role => this.make(role));
    }
}