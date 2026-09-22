import { User } from '../../../iam/users/domain/user.model.js';
import { Branch } from '../../../branches/domain/branch.model.js';
import { Currency } from '../../currencies/domain/currency.model.js';
import { Violation } from '../../../violations/violations/domain/violation.model.js';

export type PaymentAttributes = {

    id?: number;

    receiptNumber: string;

    accountantId: number;
    branchId: number;
    violationId: number;
    currencyId: number;

    amount: number;
    status: string;
    paidAt: string;
    notes?: string | null;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    accountant?: User;
    branch?: Branch;
    violation?: Violation;
    currency?: Currency;

};

export class Payment {
    private attributes: PaymentAttributes;

    constructor(attributes: PaymentAttributes) {
        this.attributes = {
            deletedAt: null,
            ...attributes,
        };
    }

    // ============================================================
    // Attributes
    // ============================================================

    get id(): number | undefined {
        return this.attributes.id;
    }

    get receiptNumber(): string {
        return this.attributes.receiptNumber;
    }

    get accountantId(): number {
        return this.attributes.accountantId;
    }

    get branchId(): number {
        return this.attributes.branchId;
    }

    get violationId(): number {
        return this.attributes.violationId;
    }

    get currencyId(): number {
        return this.attributes.currencyId;
    }

    get amount(): number {
        return this.attributes.amount;
    }

    get status(): string {
        return this.attributes.status;
    }

    get paidAt(): string {
        return this.attributes.paidAt;
    }

    get notes(): string | null | undefined {
        return this.attributes.notes;
    }

    get createdAt(): string | undefined {
        return this.attributes.createdAt;
    }

    get updatedAt(): string | undefined {
        return this.attributes.updatedAt;
    }

    get deletedAt(): string | null {
        return this.attributes.deletedAt ?? null;
    }

    // ============================================================
    // Relations
    // ============================================================

    get accountant(): User | undefined {
        return this.attributes.accountant;
    }

    get branch(): Branch | undefined {
        return this.attributes.branch;
    }

    get violation(): Violation | undefined {
        return this.attributes.violation;
    }

    get currency(): Currency | undefined {
        return this.attributes.currency;
    }

    // ============================================================
    // State
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): PaymentAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): PaymentAttributes {
        return {
            ...this.attributes,
        };
    }
}
