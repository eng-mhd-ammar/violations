import { RoleResource } from '../../../../roles/presentation/http/resources/role.resource.js';
import { UserResource } from '../../../../users/presentation/http/resources/user.resource.js';
import { UserRole } from '../../../domain/user-role.model.js';

export class UserRoleResource {
    static make(userRole: UserRole) {
        return {
            id: userRole.id,

            user: userRole.user? UserResource.make(userRole.user): null,

            role: userRole.role? RoleResource.make(userRole.role): null,
        };
    }

    static collection(userRoles: UserRole[]) {
        return userRoles.map((userRole) =>
            this.make(userRole),
        );
    }
}