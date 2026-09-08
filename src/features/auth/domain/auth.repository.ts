export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface AuthRole {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  username: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  branchId: number | null;
  roles: AuthRole[];
}

export interface AuthRepository {
  findUserForLogin( identifier: string): Promise<AuthUser | null>;
}