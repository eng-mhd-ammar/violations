import { RolePermission } from '../../../domain/role-permission.model.js';
import { RoleResource } from '../../../../roles/presentation/http/resources/role.resource.js';
import { PermissionResource } from '../../../../permissions/presentation/http/resources/permission.resource.js';

export interface RolePermissionResourceData {
    id: number | undefined;
    role: ReturnType<typeof RoleResource.make> | null;
    permission: ReturnType<typeof PermissionResource.make> | null;
}

export class RolePermissionResource {
    static make( rolePermission: RolePermission, includes: string[] = []): RolePermissionResourceData {
        const resource: RolePermissionResourceData = {
            id: rolePermission.id,

            role: rolePermission.role
                ? RoleResource.make(
                    rolePermission.role,
                    includes,
                )
                : null,

            permission: rolePermission.permission
                ? PermissionResource.make(
                    rolePermission.permission,
                    includes,
                )
                : null,
        };

        return resource;
    }

    static collection(rolePermissions: RolePermission[], includes: string[] = []): RolePermissionResourceData[] {
        return rolePermissions.map(
            (rolePermission) =>
                this.make(
                    rolePermission,
                    includes,
                ),
        );
    }
}