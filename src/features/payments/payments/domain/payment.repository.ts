import { Payment } from './payment.model.js';
import type { PaymentAttributes } from './payment.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export abstract class PaymentRepository {
    abstract create(payment: Payment): Promise<Payment>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Payment | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Payment | null>;

    abstract first(options?: QueryOptions): Promise<Payment | null>;

    abstract update(id: number, data: Partial<PaymentAttributes>): Promise<Payment>;

    abstract delete(id: number): Promise<Payment>;

    abstract restore(id: number): Promise<Payment>;

    abstract forceDelete(id: number): Promise<Payment>;
}