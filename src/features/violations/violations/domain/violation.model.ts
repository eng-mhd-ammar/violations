import { Branch } from '../../../branches/domain/branch.model.js';
import { Citizen } from '../../../citizens/domain/citizen.model.js';
import { User } from '../../../iam/users/domain/user.model.js';
import { Currency } from '../../../payments/currencies/domain/currency.model.js';
import { ViolationType } from '../../violation-types/domain/violation-type.model.js';

export type ViolationAttributes = {
    id?: number;

    violationNumber: string;

    citizenId: number;
    violationTypeId: number;
    branchId: number;
    officerId: number;

    paidCurrencyId: number;

    plateNumber: string;
    plateCode: string;
    plateCategory: string;
    vehicleType: string;
    make: string;
    model: string;
    color: string;
    manufactureYear: string;

    status: string;

    fineAmount: number;

    violationDate: string;

    location: string;

    cancelledAt?: string;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    citizen?: Citizen;
    violationType?: ViolationType;
    branch?: Branch;
    officer?: User;
    paidCurrency?: Currency;
};

export type ViolationUpdateAttributes = Partial<
    Pick<
        ViolationAttributes,
        | 'violationNumber'
        | 'citizenId'
        | 'violationTypeId'
        | 'branchId'
        | 'officerId'
        | 'paidCurrencyId'
        | 'plateNumber'
        | 'plateCode'
        | 'plateCategory'
        | 'vehicleType'
        | 'make'
        | 'model'
        | 'color'
        | 'manufactureYear'
        | 'status'
        | 'fineAmount'
        | 'violationDate'
        | 'location'
        | 'cancelledAt'
    >
>;

export class Violation {
    private attributes: ViolationAttributes;

    constructor(attributes: ViolationAttributes) {
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

    get violationNumber(): string {
        return this.attributes.violationNumber;
    }

    get citizenId(): number {
        return this.attributes.citizenId;
    }

    get violationTypeId(): number {
        return this.attributes.violationTypeId;
    }

    get branchId(): number {
        return this.attributes.branchId;
    }

    get officerId(): number {
        return this.attributes.officerId;
    }

    get paidCurrencyId(): number {
        return this.attributes.paidCurrencyId;
    }

    get plateNumber(): string {
        return this.attributes.plateNumber;
    }

    get plateCode(): string {
        return this.attributes.plateCode;
    }

    get plateCategory(): string {
        return this.attributes.plateCategory;
    }

    get vehicleType(): string {
        return this.attributes.vehicleType;
    }

    get make(): string {
        return this.attributes.make;
    }

    get model(): string {
        return this.attributes.model;
    }

    get color(): string {
        return this.attributes.color;
    }

    get manufactureYear(): string {
        return this.attributes.manufactureYear;
    }

    get status(): string {
        return this.attributes.status;
    }

    get fineAmount(): number {
        return this.attributes.fineAmount;
    }

    get violationDate(): string {
        return this.attributes.violationDate;
    }

    get location(): string {
        return this.attributes.location;
    }

    get cancelledAt(): string | undefined {
        return this.attributes.cancelledAt;
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

    get citizen(): Citizen | undefined {
        return this.attributes.citizen;
    }

    get violationType(): ViolationType | undefined {
        return this.attributes.violationType;
    }

    get branch(): Branch | undefined {
        return this.attributes.branch;
    }

    get officer(): User | undefined {
        return this.attributes.officer;
    }

    get paidCurrency(): Currency | undefined {
        return this.attributes.paidCurrency;
    }

    // ============================================================
    // Mutations
    // ============================================================

    update(attributes: ViolationUpdateAttributes): void {
        Object.assign(this.attributes, attributes);
    }

    // ============================================================
    // Violation
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    getUpdateAttributes(): ViolationUpdateAttributes {
        return {
            violationNumber: this.attributes.violationNumber,
            citizenId: this.attributes.citizenId,
            violationTypeId: this.attributes.violationTypeId,
            branchId: this.attributes.branchId,
            officerId: this.attributes.officerId,
            paidCurrencyId: this.attributes.paidCurrencyId,
            plateNumber: this.attributes.plateNumber,
            plateCode: this.attributes.plateCode,
            plateCategory: this.attributes.plateCategory,
            vehicleType: this.attributes.vehicleType,
            make: this.attributes.make,
            model: this.attributes.model,
            color: this.attributes.color,
            manufactureYear: this.attributes.manufactureYear,
            status: this.attributes.status,
            fineAmount: this.attributes.fineAmount,
            violationDate: this.attributes.violationDate,
            location: this.attributes.location,
            cancelledAt: this.attributes.cancelledAt,
        };
    }

    toAttributes(): ViolationAttributes {
        return {
            ...this.attributes,
        };
    }
}