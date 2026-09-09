import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Res} from '@nestjs/common';

import { UsersService } from '../../application/users.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResource } from './resources/user.resource.js';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import type { Response as ExpressResponse } from 'express';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    /**
    * Create a new user
    *
    * POST /users
    */
    @Can('users_create')
    @Post()
    async create(@Body() dto: CreateUserDto, @Res() res: ExpressResponse) {
        const user = await this.usersService.create(dto);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'User created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all users
    *
    * GET /users
    */
    @Can('users_index')
    @Get()
    async findAll(@Res() res: ExpressResponse) {
        const users = await this.usersService.findAll();
        const data = UserResource.collection(users);

        return new ResponseUtil(res).success(data, 'Users retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single user
    *
    * GET /users/:id
    */
    @Can('users_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const user = await this.usersService.findById(id);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'Users retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a user
    *
    * PATCH /users/:id
    */
    @Can('users_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Res() res: ExpressResponse) {
        const user = await this.usersService.update(id, dto);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'User updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Soft delete a user
    *
    * DELETE /users/:id
    */
    @Can('users_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const user = await this.usersService.delete(id);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'User deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted user
    *
    * POST /users/:id/restore
    */
    @Can('users_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const user = await this.usersService.restore(id);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'User restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a user
    *
    * POST /users/:id/force-delete
    */
    @Can('users_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const user = await this.usersService.forceDelete(id);
        const data = UserResource.make(user);

        return new ResponseUtil(res).success(data, 'User force deleted successfully', ResponseUtil.HTTP_OK);
    }
}