import type { AuthUser } from '../../../domain/auth.repository.js';

import { AuthUserResource } from './auth-user.resource.js';

export class LoginResource {
    access_token: string;
    refresh_token: string;
    user: AuthUserResource;
    roles: string[];
    permissions: string[];

    constructor(accessToken: string, refreshToken: string, user: AuthUser, roles: string[], permissions: string[]) {
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
        this.user = new AuthUserResource(user);
        this.roles = roles;
        this.permissions = permissions;
    }
}