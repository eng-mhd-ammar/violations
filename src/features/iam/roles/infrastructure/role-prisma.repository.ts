import { Injectable } from '@nestjs/common';

import { RoleRepository } from '../domain/role.repository.js';

import { PrismaService } from '../../../../core/database/prisma.service.js';
import {
    Role,
    RoleAttributes,
} from '../domain/role.model.js';

@Injectable()
export class RolePrismaRepository implements RoleRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(role: Role): Promise<Role> {
        const data = role.toAttributes();

        const created =
            await this.prisma.db.orm.public.Role.create({
                name: data.name,
                slug: data.slug,
                description: data.description ?? null,
                isActive: data.isActive,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<Role[]> {
        const roles =
            await this.prisma.db.orm.public.Role
                .where({
                    deletedAt: null,
                })
                .all();

        return roles.map((role) =>
            this.toDomain(role),
        );
    }

    async findById(id: number): Promise<Role | null> {
        const role =
            await this.prisma.db.orm.public.Role
                .where({
                    id,
                    deletedAt: null,
                })
                .first();

        if (!role) {
            return null;
        }

        return this.toDomain(role);
    }

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<Role | null> {
        const role =
            await this.prisma.db.orm.public.Role
                .where({ id })
                .first();

        if (!role) {
            return null;
        }

        return this.toDomain(role);
    }

    async findBySlug(slug: string): Promise<Role | null> {
        const role =
            await this.prisma.db.orm.public.Role
                .where({
                    slug,
                    deletedAt: null,
                })
                .first();

        if (!role) {
            return null;
        }

        return this.toDomain(role);
    }

    async update(
        id: number,
        data: Partial<RoleAttributes>,
    ): Promise<Role> {
        const updateData =
            this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.Role
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `Role with id ${id} not found`,
            );
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<Role> {
        const deleted =
            await this.prisma.db.orm.public.Role
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `Role with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    async restore(id: number): Promise<Role> {
        const restored =
            await this.prisma.db.orm.public.Role
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `Role with id ${id} not found`,
            );
        }

        return this.toDomain(restored);
    }

    async forceDelete(id: number): Promise<Role> {
        const deleted =
            await this.prisma.db.orm.public.Role
                .where({ id })
                .delete();

        if (!deleted) {
            throw new Error(
                `Role with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(
        data: Partial<RoleAttributes>,
    ): Partial<RoleAttributes> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.slug !== undefined && {
                slug: data.slug,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    }): Role {
        return new Role({
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}
