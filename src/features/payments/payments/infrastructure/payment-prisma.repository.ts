import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { Payment, type PaymentAttributes } from '../domain/payment.model.js';
import { PaymentRepository } from '../domain/payment.repository.js';

@Injectable()
export class PaymentPrismaRepository extends BaseRepository<Payment, PaymentAttributes> implements PaymentRepository
{

    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.Payment);
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'receiptNumber',
            'accountantId',
            'branchId',
            'violationId',
            'currencyId',
            'amount',
            'status',
            'paidAt',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'receiptNumber',
            'accountantId',
            'branchId',
            'violationId',
            'currencyId',
            'status',
            'paidAt',
            'createdAt',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'accountant',
            'branch',
            'violation',
            'currency',
        ];
    }

    protected allowedFields(): string[] {
        return [
            'id',
            'receiptNumber',
            'accountantId',
            'branchId',
            'violationId',
            'currencyId',
            'amount',
            'status',
            'paidAt',
            'notes',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(payment: Payment): Promise<Payment> {
        const data = payment.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        const payments =
            records.map(
                (record: PaymentAttributes) =>
                    this.toDomain(record),
            );

        // ============================================================
        // PAGINATION
        // ============================================================

        if (options.paginate === false) {
            return payments;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = payments.length;

        const start = (page - 1) * perPage;

        const items = payments.slice(
            start,
            start + perPage,
        );

        return {
            items,

            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage: Math.ceil(total / perPage),
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<Payment | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Payment | null> {
        return super.find(id, options);
    }

    async update(
        id: number, data: Partial<PaymentAttributes>): Promise<Payment> {

        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {
            throw new Error(`Payment with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<Payment> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Payment with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<Payment> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Payment with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Payment> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Payment with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: PaymentAttributes): Payment {
        return new Payment(data);
    }

    private toPrismaUpdateData(data: Partial<PaymentAttributes>): Record<string, unknown> {
        return {
            ...(data.receiptNumber !== undefined && {
                receiptNumber: data.receiptNumber,
            }),

            ...(data.accountantId !== undefined && {
                accountantId: data.accountantId,
            }),

            ...(data.branchId !== undefined && {
                branchId: data.branchId,
            }),

            ...(data.violationId !== undefined && {
                violationId: data.violationId,
            }),

            ...(data.currencyId !== undefined && {
                currencyId: data.currencyId,
            }),

            ...(data.amount !== undefined && {
                amount: data.amount,
            }),

            ...(data.status !== undefined && {
                status: data.status,
            }),

            ...(data.paidAt !== undefined && {
                paidAt: data.paidAt,
            }),

            ...(data.notes !== undefined && {
                notes: data.notes,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}