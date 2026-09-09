import { Injectable } from '@nestjs/common';

import { or } from '@prisma/orm-postgres/orm-client';

import { PrismaService } from '../../../core/database/prisma.service.js';

import {
  AuthRepository,
  AuthUser,
} from '../domain/auth.repository.js';

@Injectable()
export class AuthPrismaRepository
  implements AuthRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findUserForLogin(identifier: string): Promise<AuthUser | null> {
    console.log('LOGIN IDENTIFIER:', identifier);
    const user = await this.prisma.db.orm.public.User
        .where((user) =>
          or(
            user.username.eq(identifier),
            user.phone.eq(identifier),
          ),
        )
        .include(
          'userRoles',
          (userRoles) =>
            userRoles.include(
              'role',
              (role) =>
                role.include(
                  'rolePermissions',
                  (rolePermissions) =>
                    rolePermissions.include(
                      'permission',
                    ),
                ),
            ),
        )
        .first();

      console.dir(user, { depth: null });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      branchId: user.branchId,

      roles: user.userRoles
        .filter(
          (userRole) =>
            userRole.role.isActive === true,
        )
        .map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
          slug: userRole.role.slug,
          createdAt: userRole.role.createdAt,

          permissions:
            userRole.role.rolePermissions.map(
              (rolePermission) => ({
                id:
                  rolePermission.permission.id,

                name:
                  rolePermission.permission.name,

                slug:
                  rolePermission.permission.slug,

                createdAt:
                  rolePermission.permission.createdAt,
              }),
            ),
        })),
    };
  }
}