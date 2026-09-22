import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { PaymentsService } from '../../application/payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentResource } from './resources/payment.resource.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/payments')
export class PaymentsController {

    constructor(private readonly paymentsService: PaymentsService) {}

    /**
    * Create a new payment
    *
    * POST /payments
    */
    @Can('payments_create')
    @Post()
    async create(@Body() dto: CreatePaymentDto, @Res() res: ExpressResponse,) {
        const payment = await this.paymentsService.create(dto);
        const data = PaymentResource.make(payment);

        return new ResponseUtil(res).success(data, 'Payment created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all payments
    *
    * GET /payments
    */
    @Can('payments_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.paymentsService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: PaymentResource.collection(items),
            

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Payments retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single payment
    *
    * GET /payments/:id
    */
    @Can('payments_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const user = await this.paymentsService.findById(id);
        const data = PaymentResource.make(user);

        return new ResponseUtil(res).success(data, 'Payment retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a payment
    *
    * PATCH /payments/:id
    */
    @Can('payments_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto, @Res() res: ExpressResponse) {
        const payment = await this.paymentsService.update(id, dto);
        const data = PaymentResource.make(payment);

        return new ResponseUtil(res).success(
            data,
            'Payment updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
    * Soft delete a payment
    *
    * DELETE /payments/:id
    */
    @Can('payments_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const payment = await this.paymentsService.delete(id);
        const data = PaymentResource.make(payment);

        return new ResponseUtil(res).success(data, 'Payment deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted payment
    *
    * POST /payments/:id/restore
    */
    @Can('payments_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const payment = await this.paymentsService.restore(id);
        const data = PaymentResource.make(payment);

        return new ResponseUtil(res).success(data, 'Payment restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a payment
    *
    * DELETE /payments/:id/force-delete
    */
    @Can('payments_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const payment = await this.paymentsService.forceDelete(id);
        const data = PaymentResource.make(payment);

        return new ResponseUtil(res).success(data, 'Payment force deleted successfully', ResponseUtil.HTTP_OK);
    }
}