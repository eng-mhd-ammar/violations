import type { AuthUser } from '../../../domain/auth.repository.js';
import { AuthUserResource } from './auth-user.resource.js';

export class LoginResource {
  access_token: string;
  user: AuthUserResource;

  constructor(accessToken: string, user: AuthUser) {
    this.access_token = accessToken;
    this.user = new AuthUserResource(user);
  }
}