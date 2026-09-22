import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { ObjectionsService } from '../../application/objections.service.js';
import { CreateObjectionDto } from './dto/create-objection.dto.js';
import { ObjectionResource } from './resources/objection.resource.js';
import { UpdateObjectionDto } from './dto/update-objection.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/objections')
export class ObjectionsController {

    constructor(private readonly objectionsService: ObjectionsService) {}

    /**
    * Create a new objection
    *
    * POST /objections
    */
    @Can('objections_create')
    @Post()
    async create(@Body() dto: CreateObjectionDto, @Res() res: ExpressResponse,) {
        const objection = await this.objectionsService.create(dto);
        const data = ObjectionResource.make(objection);

        return new ResponseUtil(res).success(data, 'Objection created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all objections
    *
    * GET /objections
    */
    @Can('objections_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.objectionsService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: ObjectionResource.collection(items),
            

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Objections retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single objection
    *
    * GET /objections/:id
    */
    @Can('objections_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const user = await this.objectionsService.findById(id);
        const data = ObjectionResource.make(user);

        return new ResponseUtil(res).success(data, 'Objection retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a objection
    *
    * PATCH /objections/:id
    */
    @Can('objections_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateObjectionDto, @Res() res: ExpressResponse) {
        const objection = await this.objectionsService.update(id, dto);
        const data = ObjectionResource.make(objection);

        return new ResponseUtil(res).success(
            data,
            'Objection updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
    * Soft delete a objection
    *
    * DELETE /objections/:id
    */
    @Can('objections_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const objection = await this.objectionsService.delete(id);
        const data = ObjectionResource.make(objection);

        return new ResponseUtil(res).success(data, 'Objection deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted objection
    *
    * POST /objections/:id/restore
    */
    @Can('objections_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const objection = await this.objectionsService.restore(id);
        const data = ObjectionResource.make(objection);

        return new ResponseUtil(res).success(data, 'Objection restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a objection
    *
    * DELETE /objections/:id/force-delete
    */
    @Can('objections_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const objection = await this.objectionsService.forceDelete(id);
        const data = ObjectionResource.make(objection);

        return new ResponseUtil(res).success(data, 'Objection force deleted successfully', ResponseUtil.HTTP_OK);
    }
}