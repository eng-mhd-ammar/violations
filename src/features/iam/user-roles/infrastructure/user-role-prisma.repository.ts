import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
    UserRole,
    UserRoleAttributes,
} from '../domain/user-role.model.js';
import { UserRoleRepository } from '../domain/user-role.repository.js';

@Injectable()
export class UserRolePrismaRepository
    implements UserRoleRepository
{
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(userRole: UserRole): Promise<UserRole> {
        const data = userRole.toAttributes();

        const created =
            await this.prisma.db.orm.public.UserRole.create({
                userId: data.userId,
                roleId: data.roleId,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<UserRole[]> {
        const userRoles =
            await this.prisma.db.orm.public.UserRole
                .where({
                    deletedAt: null,
                })
                .all();

        return userRoles.map((userRole) =>
            this.toDomain(userRole),
        );
    }

    async findById(
        id: number,
    ): Promise<UserRole | null> {
        const userRole =
            await this.prisma.db.orm.public.UserRole
                .where({
                    id,
                    deletedAt: null,
                })
                .first();

        if (!userRole) {
            return null;
        }

        return this.toDomain(userRole);
    }

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<UserRole | null> {
        const userRole =
            await this.prisma.db.orm.public.UserRole
                .where({ id })
                .first();

        if (!userRole) {
            return null;
        }

        return this.toDomain(userRole);
    }

    async update(
        id: number,
        data: Partial<UserRoleAttributes>,
    ): Promise<UserRole> {
        const updateData =
            this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.UserRole
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `UserRole with id ${id} not found`,
            );
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<UserRole> {
        const deleted =
            await this.prisma.db.orm.public.UserRole
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `UserRole with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    async restore(id: number): Promise<UserRole> {
        const restored =
            await this.prisma.db.orm.public.UserRole
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `UserRole with id ${id} not found`,
            );
        }

        return this.toDomain(restored);
    }

    async forceDelete(id: number): Promise<UserRole> {
        const deleted =
            await this.prisma.db.orm.public.UserRole
                .where({ id })
                .delete();

        if (!deleted) {
            throw new Error(
                `UserRole with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(
        data: Partial<UserRoleAttributes>,
    ) {
        return {
            ...(data.userId !== undefined && {
                userId: data.userId,
            }),
        
            ...(data.roleId !== undefined && {
                roleId: data.roleId,
            }),
        
            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        userId: number;
        roleId: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    }): UserRole {
        return new UserRole({
            id: data.id,
            userId: data.userId,
            roleId: data.roleId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}