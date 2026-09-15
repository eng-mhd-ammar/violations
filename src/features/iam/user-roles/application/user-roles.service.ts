import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../domain/user-role.model.js';
import type { UserRoleAttributes } from '../domain/user-role.model.js';
import { USER_ROLE_REPOSITORY } from '../domain/user-role.repository.js';
import type { UserRoleRepository } from '../domain/user-role.repository.js';
import { UpdateUserRoleDto } from '../presentation/http/dto/update-user-role.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { CreateUserRoleDto } from '../presentation/http/dto/create-user-role.dto.js';

@Injectable()
export class UserRolesService {
    constructor(@Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: UserRoleRepository) {}

    async create(dto: CreateUserRoleDto): Promise<UserRole> {
        const userRole = new UserRole({ userId: dto.userId, roleId: dto.roleId });

        return this.userRoleRepository.create(userRole);
    }

    async findAll(options: QueryOptions = {}) {
        return this.userRoleRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<UserRole> {
        const userRole = await this.userRoleRepository.find(id, options);

        if (!userRole) {
            throw new NotFoundException(
                `UserRole with id ${id} not found`,
            );
        }

        return userRole;
    }

    async update(id: number, dto: UpdateUserRoleDto): Promise<UserRole> {
        const userRole = await this.findById(id);

        const data: Partial<UserRoleAttributes> = {
            roleId: userRole.roleId,
            userId: userRole.userId,
        };

        return this.userRoleRepository.update(id, data);
    }

    async delete(id: number): Promise<UserRole> {
        const userRole = await this.findById(id);

        return this.userRoleRepository.delete(id);
    }

    async restore(id: number): Promise<UserRole> {
        const userRole = await this.userRoleRepository.find(id, { trashed: 'only'});

        if (!userRole) {
            throw new NotFoundException(
                `UserRole with id ${id} not found`,
            );
        }

        if (!userRole.deletedAt) {
            return userRole;
        }

        return this.userRoleRepository.restore(id);
    }

    async forceDelete(id: number): Promise<UserRole> {

        await this.findById(id);

        return this.userRoleRepository.forceDelete(id);
    }
}