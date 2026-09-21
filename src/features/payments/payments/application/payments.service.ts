import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../domain/payment.model.js';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository.js';
import type { PaymentRepository } from '../domain/payment.repository.js';
import { CreatePaymentDto } from '../presentation/http/dto/create-payment.dto.js';
import { UpdatePaymentDto } from '../presentation/http/dto/update-payment.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class PaymentsService {
    constructor(@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: PaymentRepository) {}

    async create(dto: CreatePaymentDto): Promise<Payment> {
        const payment = new Payment(dto);

        return this.paymentRepository.create(payment);
    }

    async findAll(options: QueryOptions = {}) {
        return this.paymentRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Payment> {
        const payment = await this.paymentRepository.find(id, options);

        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }

        return payment;
    }

    async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
        await this.findById(id);

        return this.paymentRepository.update(id, dto);
    }

    async delete(id: number): Promise<Payment> {
        await this.findById(id);

        return this.paymentRepository.delete(id);
    }

    async restore(id: number): Promise<Payment> {
        const payment = await this.paymentRepository.find(id, { trashed: 'only' });

        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }
                
        // Check active payment with the same payment receipt number
        const activePaymentByNumber =
            await this.paymentRepository.findOneBy({
                receiptNumber: payment.receiptNumber,
                deletedAt: null,
            });

        if (activePaymentByNumber) {
            throw new ConflictException(`Cannot restore payment "${payment.receiptNumber}" because an active payment with the same receipt number already exists.`);
        }

        if (!payment.deletedAt) {
            return payment;
        }

        return this.paymentRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Payment> {
        return this.paymentRepository.forceDelete(id);
    }
}