import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { StatesService } from '../../application/states.service.js';
import { CreateStateDto } from './dto/create-state.dto.js';
import { StateResource } from './resources/state.resource.js';
import { UpdateStateDto } from './dto/update-state.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/states')
export class StatesController {

    constructor(private readonly statesService: StatesService) {}

    /**
    * Create a new state
    *
    * POST /states
    */
    @Can('states_create')
    @Post()
    async create(@Body() dto: CreateStateDto, @Res() res: ExpressResponse) {
        const state = await this.statesService.create(dto);
        const data = StateResource.make(state);

        return new ResponseUtil(res).success(data, 'State created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all states
    *
    * GET /states
    */
    @Can('states_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.statesService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: StateResource.collection(items),
            

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'States retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single state
    *
    * GET /states/:id
    */
    @Can('states_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const user = await this.statesService.findById(id);
        const data = StateResource.make(user);

        return new ResponseUtil(res).success(data, 'State retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a state
    *
    * PATCH /states/:id
    */
    @Can('states_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStateDto, @Res() res: ExpressResponse) {
        const state = await this.statesService.update(id, dto);
        const data = StateResource.make(state);

        return new ResponseUtil(res).success(
            data,
            'State updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
    * Soft delete a state
    *
    * DELETE /states/:id
    */
    @Can('states_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const state = await this.statesService.delete(id);
        const data = StateResource.make(state);

        return new ResponseUtil(res).success(data, 'State deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted state
    *
    * POST /states/:id/restore
    */
    @Can('states_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const state = await this.statesService.restore(id);
        const data = StateResource.make(state);

        return new ResponseUtil(res).success(data, 'State restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a state
    *
    * DELETE /states/:id/force-delete
    */
    @Can('states_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const state = await this.statesService.forceDelete(id);
        const data = StateResource.make(state);

        return new ResponseUtil(res).success(data, 'State force deleted successfully', ResponseUtil.HTTP_OK);
    }
}