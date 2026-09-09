import { RoleResource } from '../../../../roles/presentation/http/resources/role.resource.js';
import { PermissionResource } from '../../../../permissions/presentation/http/resources/permission.resource.js';
import { RolePermission } from '../../../domain/user-role.model.js';

export class RolePermissionResource {
    static make(rolePermission: RolePermission) {
        return {
            id: rolePermission.id,

            role: rolePermission.role
                ? RoleResource.make(rolePermission.role)
                : null,

            permission: rolePermission.permission
                ? PermissionResource.make(rolePermission.permission)
                : null,
        };
    }

    static collection(rolePermissions: RolePermission[]) {
        return rolePermissions.map((rolePermission) =>
            this.make(rolePermission),
        );
    }
}