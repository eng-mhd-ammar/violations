import { RoleResource } from '../../../../roles/presentation/http/resources/role.resource.js';
import { UserResource } from '../../../../users/presentation/http/resources/user.resource.js';
import { UserRole } from '../../../domain/user-role.model.js';

export interface UserRoleResourceData {
    id: number | undefined;

    user: ReturnType<typeof UserResource.make> | null;
    role: ReturnType<typeof RoleResource.make> | null;
}

export class UserRoleResource {

    static make(userRole: UserRole): UserRoleResourceData {

        const resource: UserRoleResourceData = {
            id: userRole.id,

            user: userRole.user? UserResource.make(userRole.user): null,

            role: userRole.role? RoleResource.make(userRole.role): null,
        };

        return resource;
    }

    static collection(userRoles: UserRole[]): UserRoleResourceData[] {
        return userRoles.map(
            (userRole) =>
                this.make(
                    userRole,
                ),
        );
    }
}