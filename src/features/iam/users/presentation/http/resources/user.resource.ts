import { User } from '../../../domain/user.model.js';

export class UserResource {
    static make(user: User) {
        return {
            id: user.id,
            username: user.username,
            phone: user.phone,
            first_name: user.firstName,
            last_name: user.lastName,
            full_name: user.fullName,
            is_active: user.isActive,
            branch_id: user.branchId,
        };
    }

    static collection(users: User[]) {
        return users.map((user) => this.make(user));
    }
}