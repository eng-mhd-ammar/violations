import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { CreateCurrencyDto } from './dto/create-currency.dto.js';
import { CurrencyResource } from './resources/currency.resource.js';
import { UpdateCurrencyDto } from './dto/update-currency.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';
import { CurrenciesService } from '../../application/currencies.service.js';

@Controller('/api/v1/currencies')
export class CurrenciesController {

    constructor(private readonly currencyService: CurrenciesService) {}

    /**
     * Create a new currency
     *
     * POST /currency
     */
    @Can('currency_create')
    @Post()
    async create(@Body() dto: CreateCurrencyDto, @Res() res: ExpressResponse,) {
        const currency = await this.currencyService.create(dto);
        const data = CurrencyResource.make(currency);

        return new ResponseUtil(res).success(data, 'Currency created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all currency
     *
     * GET /currency
     */
    @Can('currency_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.currencyService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: CurrencyResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Currency retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single currency
     *
     * GET /currency/:id
     */
    @Can('currency_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const currency = await this.currencyService.findById(id, query);
        const data = CurrencyResource.make( currency, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Currency retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a currency
     *
     * PATCH /currency/:id
     */
    @Can('currency_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCurrencyDto, @Res() res: ExpressResponse) {
        const currency = await this.currencyService.update(id, dto);
        const data = CurrencyResource.make(currency);

        return new ResponseUtil(res).success(data, 'Currency updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Soft delete a currency
     *
     * DELETE /currency/:id
     */
    @Can('currency_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const currency = await this.currencyService.delete(id);
        const data = CurrencyResource.make(currency);

        return new ResponseUtil(res).success(data, 'Currency deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted currency
     *
     * POST /currency/:id/restore
     */
    @Can('currency_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const currency = await this.currencyService.restore(id);
        const data = CurrencyResource.make(currency);

        return new ResponseUtil(res).success(data, 'Currency restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete a currency
     *
     * DELETE /currency/:id/force-delete
     */
    @Can('currency_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const currency = await this.currencyService.forceDelete(id);
        const data = CurrencyResource.make(currency);

        return new ResponseUtil(res).success(data, 'Currency force deleted successfully', ResponseUtil.HTTP_OK);
    }
}