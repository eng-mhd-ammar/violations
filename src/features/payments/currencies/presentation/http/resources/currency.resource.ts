import { Currency } from '../../../domain/currency.model.js';

export interface CurrencyResourceData {
    id: number | undefined;

    name: string;
    code: string;

    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | null;

    // payments?: ReturnType<typeof PaymentResource.make>[];
}

export class CurrencyResource {

    static make(currency: Currency): CurrencyResourceData {

        const resource: CurrencyResourceData = {
            id: currency.id,
            name: currency.name,
            code: currency.code,
            createdAt: currency.createdAt,
            updatedAt: currency.updatedAt,
            deletedAt: currency.deletedAt,
        };

        // if (currency.payments) {
        //     resource.payments =
        //         PaymentResource.collection(
        //             currency.payments,
        //         );
        // }

        return resource;
    }

    static collection(currencies: Currency[]): CurrencyResourceData[] {
        return currencies.map(
            (currency) =>
                this.make(currency),
        );
    }
}