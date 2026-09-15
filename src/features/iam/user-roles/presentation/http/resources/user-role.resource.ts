import { RoleResource } from '../../../../roles/presentation/http/resources/role.resource.js';
import { UserResource } from '../../../../users/presentation/http/resources/user.resource.js';
import { UserRole } from '../../../domain/user-role.model.js';

export interface UserRoleResourceData {
    id: number | undefined;
    user: ReturnType<typeof UserResource.make> | null;
    role: ReturnType<typeof RoleResource.make> | null;
}

export class UserRoleResource {
    static make(userRole: UserRole, includes: string[] = []): UserRoleResourceData {

        const resource: UserRoleResourceData = {
            id: userRole.id,

            user: userRole.user? UserResource.make(userRole.user, includes): null,

            role: userRole.role? RoleResource.make(userRole.role, includes) : null,
        };

        return resource;
    }

    static collection(userRoles: UserRole[], includes: string[] = []): UserRoleResourceData[] {
        return userRoles.map(
            (userRole) =>
                this.make(
                    userRole,
                    includes,
                ),
        );
    }
}