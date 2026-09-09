import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Res,
} from '@nestjs/common';

import type { Response as ExpressResponse } from 'express';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

import { ResponseUtil } from '../../../../../shared/utils/response.js';

import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { UserRolesService } from '../../application/user-roles.service.js';
import { CreateUserRoleDto } from './dto/create.user-role.dto.js';
import { UserRoleResource } from './resources/user-role.resource.js';

@Controller('/api/v1/user-roles')
export class UserRolesController {

    constructor(
        private readonly userRolesService: UserRolesService,
    ) {}

    /**
     * Create a new user role
     *
     * POST /user-roles
     */
    @Can('user_roles_create')
    @Post()
    async create(
        @Body() dto: CreateUserRoleDto,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.create(dto);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role created successfully',
            ResponseUtil.HTTP_CREATED,
        );
    }

    /**
     * Get all user roles
     *
     * GET /user-roles
     */
    @Can('user_roles_index')
    @Get()
    async findAll(
        @Res() res: ExpressResponse,
    ) {
        const userRoles =
            await this.userRolesService.findAll();

        const data =
            UserRoleResource.collection(userRoles);

        return new ResponseUtil(res).success(
            data,
            'User roles retrieved successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Get a single user role
     *
     * GET /user-roles/:id
     */
    @Can('user_roles_show')
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.findById(id);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role retrieved successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Update a user role
     *
     * PATCH /user-roles/:id
     */
    @Can('user_roles_update')
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserRoleDto,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.update(id, dto);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Soft delete a user role
     *
     * DELETE /user-roles/:id
     */
    @Can('user_roles_delete')
    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.delete(id);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Restore a soft-deleted user role
     *
     * POST /user-roles/:id/restore
     */
    @Can('user_roles_restore')
    @Get(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.restore(id);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role restored successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Force delete a user role
     *
     * DELETE /user-roles/:id/force-delete
     */
    @Can('user_roles_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const userRole =
            await this.userRolesService.forceDelete(id);

        const data =
            UserRoleResource.make(userRole);

        return new ResponseUtil(res).success(
            data,
            'User role force deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }
}