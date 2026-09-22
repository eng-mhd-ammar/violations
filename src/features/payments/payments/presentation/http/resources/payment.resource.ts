import { Payment } from '../../../domain/payment.model.js';

import { UserResource } from '../../../../../iam/users/presentation/http/resources/user.resource.js';

import { BranchResource } from '../../../../../branches/presentation/http/resources/branch.resource.js';

import { CurrencyResource } from '../../../../currencies/presentation/http/resources/currency.resource.js';

import { ViolationResource } from '../../../../../violations/violations/presentation/http/resources/violation.resource.js';

export interface PaymentResourceData {
    id: number | undefined;

    receiptNumber: string;

    accountantId: number;
    branchId: number;
    violationId: number;
    currencyId: number;

    amount: number;
    status: string;
    paidAt: string;
    notes?: string | null;

    accountant?: ReturnType<typeof UserResource.make>;
    branch?: ReturnType<typeof BranchResource.make>;
    violation?: ReturnType<typeof ViolationResource.make>;
    currency?: ReturnType<typeof CurrencyResource.make>;
}

export class PaymentResource {

    static make(payment: Payment): PaymentResourceData {

        const resource: PaymentResourceData = {
            id: payment.id,
            receiptNumber: payment.receiptNumber,
            accountantId: payment.accountantId,
            branchId: payment.branchId,
            violationId: payment.violationId,
            currencyId: payment.currencyId,
            amount: payment.amount,
            status: payment.status,
            paidAt: payment.paidAt,
            notes: payment.notes,
        };

        if (payment.accountant) {
            resource.accountant = UserResource.make(payment.accountant);
        }

        if (payment.branch) {
            resource.branch = BranchResource.make(payment.branch);
        }

        if (payment.violation) {

            resource.violation = ViolationResource.make(payment.violation);
        }

        if (payment.currency) {
            resource.currency = CurrencyResource.make(payment.currency);
        }

        return resource;
    }

    static collection(payments: Payment[]): PaymentResourceData[] {
        return payments.map(
            (payment) =>
                this.make(
                    payment,
                ),
        );
    }
}