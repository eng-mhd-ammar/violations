import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../shared/utils/response.js';
import { Can } from '../../../../core/authorization/decorators/can.decorator.js';
import { CitizensService } from '../../application/citizens.service.js';
import { CreateCitizenDto } from './dto/create-citizen.dto.js';
import { CitizenResource } from './resources/citizen.resource.js';
import { UpdateCitizenDto } from './dto/update-citizen.dto.js';
import { QueryDto } from '../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/citizens')
export class CitizensController {

    constructor(private readonly citizensService: CitizensService) {}

    /**
    * Create a new citizen
    *
    * POST /citizens
    */
    @Can('citizens_create')
    @Post()
    async create(@Body() dto: CreateCitizenDto, @Res() res: ExpressResponse,) {
        const citizen = await this.citizensService.create(dto);
        const data = CitizenResource.make(citizen);

        return new ResponseUtil(res).success(data, 'Citizen created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all citizens
    *
    * GET /citizens
    */
    @Can('citizens_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.citizensService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: CitizenResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Citizens retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single citizen
    *
    * GET /citizens/:id
    */
    @Can('citizens_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const user = await this.citizensService.findById(id);
        const data = CitizenResource.make(user, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Citizen retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a citizen
    *
    * PATCH /citizens/:id
    */
    @Can('citizens_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCitizenDto, @Res() res: ExpressResponse) {
        const citizen = await this.citizensService.update(id, dto);
        const data = CitizenResource.make(citizen);

        return new ResponseUtil(res).success(
            data,
            'Citizen updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
    * Soft delete a citizen
    *
    * DELETE /citizens/:id
    */
    @Can('citizens_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const citizen = await this.citizensService.delete(id);
        const data = CitizenResource.make(citizen);

        return new ResponseUtil(res).success(data, 'Citizen deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted citizen
    *
    * POST /citizens/:id/restore
    */
    @Can('citizens_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const citizen = await this.citizensService.restore(id);
        const data = CitizenResource.make(citizen);

        return new ResponseUtil(res).success(data, 'Citizen restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a citizen
    *
    * DELETE /citizens/:id/force-delete
    */
    @Can('citizens_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const citizen = await this.citizensService.forceDelete(id);
        const data = CitizenResource.make(citizen);

        return new ResponseUtil(res).success(data, 'Citizen force deleted successfully', ResponseUtil.HTTP_OK);
    }
}