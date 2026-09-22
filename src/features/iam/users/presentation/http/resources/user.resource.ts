import { BranchResource } from '../../../../../branches/presentation/http/resources/branch.resource.js';
import { UserRoleResource } from '../../../../user-roles/presentation/http/resources/user-role.resource.js';

import { User } from '../../../domain/user.model.js';

export interface UserResourceData {
    id: number | undefined;

    username: string;
    phone: string;
    first_name: string;
    last_name: string;
    full_name: string;
    is_active: boolean;
    role: string| undefined;

    branch_id: number | null;

    userRoles?: ReturnType<typeof UserRoleResource.make>[];
    branch?: ReturnType<typeof BranchResource.make>;
}

export class UserResource {

    static make(user: User): UserResourceData {

        const resource: UserResourceData = {
            id: user.id,
            username: user.username,
            phone: user.phone,
            first_name: user.firstName,
            last_name: user.lastName,
            full_name: user.fullName,
            is_active: user.isActive,
            role: user.userRoles?.[0]?.role?.slug,
            branch_id: user.branchId,
        };

        // if (user.userRoles) {
        //     resource.userRoles = UserRoleResource.collection(user.userRoles);
        // }

        if (user.branch) {
            resource.branch = BranchResource.make(user.branch);
        }

        return resource;
    }

    static collection(users: User[]): UserResourceData[] {
        return users.map(
            (user) =>
                this.make(
                    user,
                ),
        );
    }
}