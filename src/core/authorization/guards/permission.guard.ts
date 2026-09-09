import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  PERMISSION_KEY,
} from '../decorators/can.decorator.js';

import type {
  AuthenticatedUser,
} from '../authenticated-user.type.js';

interface RequestWithUser {
  user?: AuthenticatedUser;
}

@Injectable()
export class PermissionGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    
    const permission =
      this.reflector.getAllAndOverride<string>(
        PERMISSION_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!permission) {
      return true;
    }

    const request =
      context
        .switchToHttp()
        .getRequest<RequestWithUser>();

    const user = request?.user;

    if (!user) {
      throw new ForbiddenException(
        'User is not authenticated',
      );
    }

    console.log('ROLES:', user.roles);

    if (user.roles.includes('admin')) {
      return true;
    }

    const permissions =
      user.permissions ?? [];

    console.log('PERMISSIONS:', permissions);

    const hasPermission =
      permissions.includes(permission);

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}