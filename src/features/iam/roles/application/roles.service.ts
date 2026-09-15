import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    Role,
} from '../domain/role.model.js';

import type {
    RoleAttributes,
} from '../domain/role.model.js';

import { ROLE_REPOSITORY } from '../domain/role.repository.js';

import type {
    RoleRepository,
} from '../domain/role.repository.js';

import {
    CreateRoleDto,
} from '../presentation/http/dto/create-role.dto.js';

import {
    UpdateRoleDto,
} from '../presentation/http/dto/update-role.dto.js';

import type {
    QueryOptions,
} from '../../../../core/database/repositories/query.types.js';

import {
    ROLE_PERMISSION_REPOSITORY,
    type RolePermissionRepository,
} from '../../role-permissions/domain/role-permission.repository.js';

@Injectable()
export class RolesService {

    constructor(@Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository, @Inject(ROLE_PERMISSION_REPOSITORY) private readonly rolePermissionRepository: RolePermissionRepository) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOneBy({
                slug: dto.slug,
                deletedAt: null,
            });

        if (existingRole) {
            throw new ConflictException(
                `Role with slug "${dto.slug}" already exists.`,
            );
        }

        const role = new Role({
            name: dto.name,
            slug: dto.slug,
            description: dto.description ?? null,
            isActive: dto.isActive ?? true,
        });

        // Create the role first.
        const createdRole = await this.roleRepository.create(role);

        // Sync permissions only whe permissions was provided.
        if (dto.permissions !== undefined && createdRole.id !== undefined) {
            await this.rolePermissionRepository.sync(createdRole.id, dto.permissions);
        }

        return createdRole;
    }

    async findAll(options: QueryOptions = {}) {
        return this.roleRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Role> {
        const role = await this.roleRepository.find(id, options);

        if (!role) {
            throw new NotFoundException(
                `Role with id ${id} not found`,
            );
        }

        return role;
    }

    async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        const role = await this.findById(id);
        
        // Check slug uniqueness only when slug is changed.
        if (dto.slug !== undefined && dto.slug !== role.slug) {
            const existingRole =
                await this.roleRepository.findOneBy({
                    slug: dto.slug,
                    deletedAt: null,
                });

            if (existingRole && existingRole.id !== id) {
                throw new ConflictException(`Role with slug "${dto.slug}" already exists.`);
            }

            role.changeSlug(dto.slug);
        }

        if (dto.name !== undefined) {
            role.changeName(dto.name);
        }
        
        if (dto.description !== undefined) {
            role.changeDescription(
                dto.description,
            );
        }
        
        if (dto.isActive !== undefined) {
            if (dto.isActive) {
                role.activate();
            } else {
                role.deactivate();
            }
        }

        const data: Partial<RoleAttributes> = {
            name: role.name,
            slug: role.slug,
            description: role.description,
            isActive: role.isActive,
        };
        
        const updatedRole = await this.roleRepository.update(id, data);

        if (dto.permissions !== undefined) {
            await this.rolePermissionRepository.sync(id, dto.permissions);
        }

        return updatedRole;
    }

    async delete(id: number): Promise<Role> {
        const role = await this.findById(id);

        return this.roleRepository.delete(id);
    }


    async restore(id: number): Promise<Role> {
        const role = await this.roleRepository.find(id, { trashed: 'only' });

        if (!role) {
            throw new NotFoundException(
                `Role with id ${id} not found`,
            );
        }

        if (!role.deletedAt) {
            return role;
        }

        // Check active role with the same name
        const activeRoleByName =
            await this.roleRepository.findOneBy({
                name: role.name,
                deletedAt: null,
            });

        if (activeRoleByName) {
            throw new ConflictException(
                `Cannot restore role "${role.slug}" because an active role with the same name already exists.`,
            );
        }

        // Check active role with the same slug
        const activeRoleBySlug =
            await this.roleRepository.findOneBy({
                slug: role.slug,
                deletedAt: null,
            });

        if (activeRoleBySlug) {
            throw new ConflictException(
                `Cannot restore role "${role.slug}" because an active role with the same slug already exists.`,
            );
        }

        return this.roleRepository.restore(id);
    }


    async forceDelete(
        id: number,
    ): Promise<Role> {

        await this.findById(id);

        return this.roleRepository.forceDelete(id);
    }
}