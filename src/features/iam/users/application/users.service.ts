import {ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { User, UserAttributes } from '../domain/user.model.js';
import { UserRepository } from '../domain/user.repository.js';

import { CreateUserDto } from '../presentation/http/dto/create-user.dto.js';
import { UpdateUserDto } from '../presentation/http/dto/update-user.dto.js';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    /**
    * Create a new user
    */
    async create(dto: CreateUserDto): Promise<User> {
        const existingUsername = await this.userRepository.findByUsername(dto.username);

        if (existingUsername) {
            throw new ConflictException('Username is already in use');
        }

        const existingPhone = await this.userRepository.findByPhone(dto.phone);

        if (existingPhone) {
            throw new ConflictException('Phone is already in use');
        }

        const user = new User({
            username: dto.username,
            phone: dto.phone,
            password: bcrypt.hashSync(dto.password, 10),

            firstName: dto.firstName,
            lastName: dto.lastName,

            isActive: dto.isActive ?? true,

            branchId: dto.branchId ?? null,
        });

        return this.userRepository.create(user);
    }

    /**
    * Get all users
    */
    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    /**
    * Get user by ID
    */
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
    }

    /**
    * Update user
    */
    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const user = await this.findById(id);

        if (dto.username !== undefined && dto.username !== user.username) {
            const existingUsername = await this.userRepository.findByUsername(dto.username);

            if (existingUsername && existingUsername.id !== id) {
                throw new ConflictException('Username is already in use');
            }
        }

        if (dto.phone !== undefined && dto.phone !== user.phone) {
            const existingPhone = await this.userRepository.findByPhone(dto.phone);

            if (existingPhone && existingPhone.id !== id) {
                throw new ConflictException('Phone is already in use');
            }
        }

        const data: Partial<UserAttributes> = {
            username: dto.username !== undefined? dto.username: user.username,
            phone: dto.phone !== undefined? dto.phone: user.phone,
            password: dto.password !== undefined? bcrypt.hashSync(dto.password, 10): user.password,

            firstName: dto.firstName !== undefined? dto.firstName: user.firstName,
            lastName: dto.lastName !== undefined? dto.lastName: user.lastName,

            isActive: dto.isActive !== undefined? dto.isActive: user.isActive,
            branchId: dto.branchId !== undefined? dto.branchId: user.branchId,
        };

        return this.userRepository.update(id, data);
    }

    /**
    * Soft delete user
    */
    async delete(id: number): Promise<User> {
        let user = await this.findById(id);
        await this.userRepository.delete(id);

        return user;
    }

    /**
    * Restore soft-deleted user
    */
    async restore(id: number): Promise<User> {
        const user = await this.userRepository.findByIdIncludingDeleted(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        if (!user.deletedAt) {
            return user;
        }

        return this.userRepository.restore(id);
    }

    /**
    * Force delete user
    */
    async forceDelete(id: number): Promise<User> {
        let user = await this.findById(id);
        await this.userRepository.forceDelete(id);
        
        return user;
    }
}
