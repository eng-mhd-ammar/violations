import { Address } from "../../locations/addresses/domain/address.model";

export type CitizenAttributes = {
    id?: number;

    nationalId: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    phone: string;
    addressId: number;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    address?: Address;
    // violation: Violation[];
    // payments: Payment[];
};

export class Citizen {
    private attributes: CitizenAttributes;

    constructor(attributes: CitizenAttributes) {
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

    get nationalId(): string {
        return this.attributes.nationalId;
    }

    get firstName(): string {
        return this.attributes.firstName;
    }

    get lastName(): string {
        return this.attributes.lastName;
    }

    get fatherName(): string {
        return this.attributes.fatherName;
    }

    get motherName(): string {
        return this.attributes.motherName;
    }

    get addressId(): number {
        return this.attributes.addressId;
    }

    get dateOfBirth(): string {
        return this.attributes.dateOfBirth;
    }

    get phone(): string {
        return this.attributes.phone;
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

    get address(): Address | undefined {
        return this.attributes.address;
    }

    // get violations(): Violation[] {
    //     return this.attributes.violations?? [];
    // }

    // get payments(): Payment[] {
    //     return this.attributes.payments?? [];
    // }

    // ============================================================
    // Mutations
    // ============================================================

    changeNationalId(nationalId: string): void {
        this.attributes.nationalId = nationalId;
    }
    
    changeFirstName(firstName: string): void {
        this.attributes.firstName = firstName;
    }
    
    changeLastName(lastName: string): void {
        this.attributes.lastName = lastName;
    }
    
    changeFatherName(fatherName: string): void {
        this.attributes.fatherName = fatherName;
    }
    
    changeMotherName(motherName: string): void {
        this.attributes.motherName = motherName;
    }
    
    changeAddressId(addressId: number): void {
        this.attributes.addressId = addressId;
    }
    
    changeDateOfBirth(dateOfBirth: string): void {
        this.attributes.dateOfBirth = dateOfBirth;
    }
    
    changePhone(phone: string): void {
        this.attributes.phone = phone;
    }

    // ============================================================
    // Citizen
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): CitizenAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): CitizenAttributes {
        return {
            ...this.attributes,
        };
    }
}