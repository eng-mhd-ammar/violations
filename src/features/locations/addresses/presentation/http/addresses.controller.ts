import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
} from '@nestjs/common';

import type { Response as ExpressResponse } from 'express';

import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { AddressesService } from '../../application/addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { AddressResource } from './resources/address.resource.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/addresses')
export class AddressesController {

    constructor(private readonly addressService: AddressesService) {}

    /**
     * Create a new address
     *
     * POST /address
     */
    @Can('address_create')
    @Post()
    async create(@Body() dto: CreateAddressDto, @Res() res: ExpressResponse,) {
        const address = await this.addressService.create(dto);
        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(data, 'Address created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all address
     *
     * GET /address
     */
    @Can('address_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.addressService.findAll(query);

        const isPaginated = 'items' in result;

        const items = isPaginated
            ? result.items
            : result;

        const data = {
            items: AddressResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Address retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single address
     *
     * GET /address/:id
     */
    @Can('address_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const address = await this.addressService.findById(id, query);
        const data = AddressResource.make( address, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Address retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a address
     *
     * PATCH /address/:id
     */
    @Can('address_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto, @Res() res: ExpressResponse) {
        const address = await this.addressService.update(id, dto);
        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Soft delete a address
     *
     * DELETE /address/:id
     */
    @Can('address_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const address = await this.addressService.delete(id);
        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(data, 'Address deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted address
     *
     * POST /address/:id/restore
     */
    @Can('address_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const address = await this.addressService.restore(id);
        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(data, 'Address restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete a address
     *
     * DELETE /address/:id/force-delete
     */
    @Can('address_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const address = await this.addressService.forceDelete(id);
        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(data, 'Address force deleted successfully', ResponseUtil.HTTP_OK);
    }
}