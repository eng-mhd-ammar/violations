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

import { ResponseUtil } from '../../../../../shared/utils/response.js';
import type { Response as ExpressResponse } from 'express';

import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { AddressesService } from '../../application/addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { AddressResource } from './resources/address.resource.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Controller('/api/v1/addresses')
export class AddressesController {

    constructor(
        private readonly addressesService: AddressesService,
    ) {}

    /**
     * Create a new address
     *
     * POST /addresses
     */
    @Can('addresses_create')
    @Post()
    async create(
        @Body() dto: CreateAddressDto,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.create(dto);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address created successfully',
            ResponseUtil.HTTP_CREATED,
        );
    }

    /**
     * Get all addresses
     *
     * GET /addresses
     */
    @Can('addresses_index')
    @Get()
    async findAll(
        @Res() res: ExpressResponse,
    ) {
        const addresses = await this.addressesService.findAll();

        const data = AddressResource.collection(addresses);

        return new ResponseUtil(res).success(
            data,
            'Addresses retrieved successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Get a single address
     *
     * GET /addresses/:id
     */
    @Can('addresses_show')
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.findById(id);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address retrieved successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Update an address
     *
     * PATCH /addresses/:id
     */
    @Can('addresses_update')
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAddressDto,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.update(id, dto);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Soft delete an address
     *
     * DELETE /addresses/:id
     */
    @Can('addresses_delete')
    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.delete(id);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Restore a soft-deleted address
     *
     * POST /addresses/:id/restore
     */
    @Can('addresses_restore')
    @Get(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.restore(id);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address restored successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Force delete an address
     *
     * DELETE /addresses/:id/force-delete
     */
    @Can('addresses_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const address = await this.addressesService.forceDelete(id);

        const data = AddressResource.make(address);

        return new ResponseUtil(res).success(
            data,
            'Address force deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }
}