import type { AuthRole } from '../../../domain/auth.repository.js';

export class AuthRoleResource {
  id: number;
  name: string;
  slug: string;

  constructor(role: AuthRole) {
    this.id = role.id;
    this.name = role.name;
    this.slug = role.slug;
  }
}