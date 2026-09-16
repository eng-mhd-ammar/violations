import { UserResource } from '../../../../../iam/users/presentation/http/resources/user.resource.js';
import { AddressResource } from '../../../../../locations/addresses/presentation/http/resources/address.resource.js';
import { Currency } from '../../../domain/currency.model.js';

export interface CurrencyResourceData {
    id: number | undefined;
    name: string;
    code: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | null;

    // payments: ReturnType<typeof PaymentResource.make>[];
}

export class CurrencyResource {

    static make(
        currency: Currency,
        includes: string[] = [],
    ): CurrencyResourceData {

        const resource: CurrencyResourceData = {
            id: currency.id,
            name: currency.name,
            code: currency.code,
            createdAt: currency.createdAt,
            updatedAt: currency.updatedAt,
            deletedAt: currency.deletedAt,

            // payments: currency.payments.length
            //     ? UserResource.collection(currency.payments, includes)
            //     : [],
        };

        return resource;
    }

    static collection(
        currencies: Currency[],
        includes: string[] = [],
    ): CurrencyResourceData[] {

        return currencies.map(
            (currency) => this.make(currency, includes),
        );
    }
}