export interface AuthenticatedUser {
  id: number;

  username: string;

  phone: string;

  roles: string[];

  permissions: string[];
}