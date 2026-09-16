import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { Currency } from './currency.model.js';
import type { CurrencyAttributes } from './currency.model.js';

export const CURRENCY_REPOSITORY = Symbol('CURRENCY_REPOSITORY');

export abstract class CurrencyRepository {
    abstract create(currency: Currency): Promise<Currency>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Currency | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Currency | null>;

    abstract first(options?: QueryOptions): Promise<Currency | null>;

    abstract update(id: number, data: Partial<CurrencyAttributes>): Promise<Currency>;

    abstract delete(id: number): Promise<Currency>;

    abstract restore(id: number): Promise<Currency>;

    abstract forceDelete(id: number): Promise<Currency>;
}