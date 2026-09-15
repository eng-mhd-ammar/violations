import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../domain/user.model.js';
import type { UserAttributes } from '../domain/user.model.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/user.repository.js';
import { CreateUserDto } from '../presentation/http/dto/create-user.dto.js';
import { UpdateUserDto } from '../presentation/http/dto/update-user.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { USER_ROLE_REPOSITORY, UserRoleRepository } from '../../user-roles/domain/user-role.repository.js';

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository, @Inject(USER_ROLE_REPOSITORY) private readonly userRoleRepository: UserRoleRepository) {}

    async create(dto: CreateUserDto): Promise<User> {
        const user = new User({
            username: dto.username,
            phone: dto.phone,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            isActive: dto.isActive,
            branchId: dto.branchId,
        });

        let createdUser = await this.userRepository.create(user);

                // Sync roles only whe permissions was provided.
        if (dto.roles !== undefined && createdUser.id !== undefined) {
            await this.userRoleRepository.sync(createdUser.id, dto.roles);
        }

        return createdUser;
    }

    async findAll(options: QueryOptions = {}) {
        return this.userRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<User> {
        const user = await this.userRepository.find(id, options);

        if (!user) {
            throw new NotFoundException(
                `User with id ${id} not found`,
            );
        }

        return user;
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {

        const user = await this.findById(id);

        if (dto.username !== undefined) {
            user.changeUsername(dto.username);
        }

        if (dto.phone !== undefined) {
            user.changePhone(dto.phone);
        }

        if (dto.password !== undefined) {
            user.changePassword(dto.password);
        }

        if (dto.firstName !== undefined) {
            user.changeFirstName(dto.firstName);
        }

        if (dto.lastName !== undefined) {
            user.changeLastName(dto.lastName);
        }

        if (dto.isActive !== undefined) {
            user.changeIsActive(dto.isActive);
        }

        if (dto.branchId !== undefined) {
            user.changeBranchId(dto.branchId);
        }

        const data: Partial<UserAttributes> = {
            username: user.username,
            phone: user.phone,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            branchId: user.branchId,
        };

        let updatedUser = this.userRepository.update(id, data);

        if (dto.roles !== undefined) {
            await this.userRoleRepository.sync(id, dto.roles);
        }

        return updatedUser;
    }


    async delete(id: number): Promise<User> {
        const user = await this.findById(id);

        return this.userRepository.delete(id);
    }


    async restore(id: number): Promise<User> {
        const user = await this.userRepository.find(id, { trashed: 'only' });

        if (!user) {
            throw new NotFoundException(
                `User with id ${id} not found`,
            );
        }

        if (!user.deletedAt) {
            return user;
        }

        // Check active user with the same username
        const activeUserByUserName =
            await this.userRepository.findOneBy({
                username: user.username,
                deletedAt: null,
            });

        if (activeUserByUserName) {
            throw new ConflictException(
                `Cannot restore user "${user.username}" because an active user with the same username already exists.`,
            );
        }

        // Check active user with the same phone
        const activeUserByPhone =
            await this.userRepository.findOneBy({
                phone: user.phone,
                deletedAt: null,
            });

        if (activeUserByPhone) {
            throw new ConflictException(
                `Cannot restore user "${user.phone}" because an active user with the same phone already exists.`,
            );
        }

        return this.userRepository.restore(id);
    }


    async forceDelete(id: number): Promise<User> {
        await this.findById(id);

        return this.userRepository.forceDelete(id);
    }
}