import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Role,
    RoleAttributes,
} from '../domain/role.model.js';

import { RoleRepository } from '../domain/role.repository.js';

import { CreateRoleDto } from '../presentation/http/dto/create-role.dto.js';
import { UpdateRoleDto } from '../presentation/http/dto/update-role.dto.js';

@Injectable()
export class RolesService {
    constructor(
        private readonly roleRepository: RoleRepository,
    ) {}

    /**
     * Create a new role
     */
    async create(
        dto: CreateRoleDto,
    ): Promise<Role> {
        const existingSlug =
            await this.roleRepository.findBySlug(dto.slug);

        if (existingSlug) {
            throw new ConflictException(
                'Role slug is already in use',
            );
        }

        const role = new Role({
            name: dto.name,
            slug: dto.slug,
            description: dto.description ?? null,
        });

        return this.roleRepository.create(role);
    }

    /**
     * Get all roles
     */
    async findAll(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }

    /**
     * Get role by ID
     */
    async findById(id: number): Promise<Role> {
        const role =
            await this.roleRepository.findById(id);

        if (!role) {
            throw new NotFoundException(
                `Role with id ${id} not found`,
            );
        }

        return role;
    }

    /**
     * Update role
     */
    async update(
        id: number,
        dto: UpdateRoleDto,
    ): Promise<Role> {
        const role = await this.findById(id);

        /**
         * Check slug uniqueness only when
         * the slug is actually changed.
         */
        if (
            dto.slug !== undefined &&
            dto.slug !== role.slug
        ) {
            const existingSlug =
                await this.roleRepository.findBySlug(
                    dto.slug,
                );

            if (
                existingSlug &&
                existingSlug.id !== id
            ) {
                throw new ConflictException(
                    'Role slug is already in use',
                );
            }
        }

        /**
         * Apply domain mutations.
         */
        if (dto.name !== undefined) {
            role.changeName(dto.name);
        }

        if (dto.slug !== undefined) {
            role.changeSlug(dto.slug);
        }

        if (dto.description !== undefined) {
            role.changeDescription(dto.description);
        }

        if (dto.isActive !== undefined) {
            if (dto.isActive) {
                role.activate();
            } else {
                role.deactivate();
            }
        }

        /**
         * Persist the updated domain entity.
         */
        const data: Partial<RoleAttributes> = {
            name: role.name,
            slug: role.slug,
            description: role.description,
            isActive: role.isActive,
        };

        return this.roleRepository.update(
            id,
            data,
        );
    }

    /**
     * Soft delete role
     */
    async delete(id: number): Promise<Role> {
        const role = await this.findById(id);

        await this.roleRepository.delete(id);

        return role;
    }

    /**
     * Restore soft-deleted role
     */
    async restore(id: number): Promise<Role> {
        const role =
            await this.roleRepository
                .findByIdIncludingDeleted(id);

        if (!role) {
            throw new NotFoundException(
                `Role with id ${id} not found`,
            );
        }

        if (!role.deletedAt) {
            return role;
        }

        return this.roleRepository.restore(id);
    }

    /**
     * Force delete role
     */
    async forceDelete(
        id: number,
    ): Promise<Role> {
        const role = await this.findById(id);

        await this.roleRepository.forceDelete(id);

        return role;
    }
}
