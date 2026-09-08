import { Injectable } from '@nestjs/common';

import {User, UserAttributes } from '../domain/user.model.js';

import { UserRepository } from '../domain/user.repository.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';

@Injectable()
export class UserPrismaRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: User): Promise<User> {
        const data = user.toAttributes();

        const created =
            await this.prisma.db.orm.public.User.create({
                username: data.username,
                phone: data.phone,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                isActive: data.isActive ?? true,
                branchId: data.branchId ?? null,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.db.orm.public.User.where({ deletedAt: null }).all();

        return users.map((user) => this.toDomain(user));
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prisma.db.orm.public.User.where({ id, deletedAt: null }).first();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async findByIdIncludingDeleted(id: number): Promise<User | null> {
        const user = await this.prisma.db.orm.public.User.where({id}).first();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.db.orm.public.User.where({ username, deletedAt: null }).first();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async findByPhone(phone: string): Promise<User | null> {
        const user = await this.prisma.db.orm.public.User.where({ phone,deletedAt: null }).first();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async update(id: number, data: Partial<UserAttributes>): Promise<User> {
        const updateData = this.toPrismaUpdateData(data);
        const updated = await this.prisma.db.orm.public.User.where({ id, deletedAt: null }).update(updateData);

        if (!updated) {
            throw new Error(`User with id ${id} not found`);
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<User> {
        const deleted = await this.prisma.db.orm.public.User.where({ id, deletedAt: null }).update({ deletedAt: new Date().toISOString() });

        if (!deleted) {
            throw new Error(`User with id ${id} not found`);
        }

        return this.toDomain(deleted);
    }

    async restore(id: number): Promise<User> {
        const restored = await this.prisma.db.orm.public.User.where({ id }).update({ deletedAt: null });
        
        if (!restored) {
            throw new Error(`User with id ${id} not found`);
        }
    
        return this.toDomain(restored);
    }

    async forceDelete(id: number): Promise<User> {
        const deleted = await this.prisma.db.orm.public.User.where({ id }).delete();

        if (!deleted) {
            throw new Error(`User with id ${id} not found`);
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(data: Partial<UserAttributes>): Partial<UserAttributes> {
        return {
            ...(data.username !== undefined && {
                username: data.username,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.password !== undefined && {
                password: data.password,
            }),

            ...(data.firstName !== undefined && {
                firstName: data.firstName,
            }),

            ...(data.lastName !== undefined && {
                lastName: data.lastName,
            }),

            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),

            ...(data.branchId !== undefined && {
                branchId: data.branchId,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        username: string;
        phone: string;
        password: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        branchId: number | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    }): User {
        return new User({
            id: data.id,
            username: data.username,
            phone: data.phone,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            isActive: data.isActive,
            branchId: data.branchId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}