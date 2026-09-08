import type { AuthUser } from '../../../domain/auth.repository.js';
import { AuthRoleResource } from './auth-role.resource.js';

export class AuthUserResource {
  id: number;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  branch_id: number | null;
  roles: AuthRoleResource[];

  constructor(user: AuthUser) {
    this.id = user.id;
    this.username = user.username;
    this.phone = user.phone;
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.branch_id = user.branchId;

    this.roles = user.roles.map(
      (role) => new AuthRoleResource(role),
    );
  }
}