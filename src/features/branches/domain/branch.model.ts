import { User } from "../../iam/users/domain/user.model";
import { Address } from "../../locations/addresses/domain/address.model";

export type BranchAttributes = {
    id?: number;
    
    name: string;
    phone: string;
    code: string;
    addressId: number

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    users?: User[];
    address?: Address;
};

export class Branch {
    private attributes: BranchAttributes;

    constructor(attributes: BranchAttributes) {
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

    get name(): string {
        return this.attributes.name;
    }

    get phone(): string {
        return this.attributes.phone;
    }

    get code(): string {
        return this.attributes.code;
    }

    get addressId(): number {
        return this.attributes.addressId;
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

    get users(): User[] {
        return this.attributes.users?? [];
    }

    get address(): Address | undefined {
        return this.attributes.address;
    }

    // ============================================================
    // Mutations
    // ============================================================

    changeName(name: string): void {
        this.attributes.name = name;
    }

    changePhone(phone: string): void {
        this.attributes.phone = phone;
    }

    changeCode(code: string): void {
        this.attributes.code = code;
    }

    changeAddressId(addressId: number): void {
        this.attributes.addressId = addressId;
    }

    // ============================================================
    // Branch
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): BranchAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): BranchAttributes {
        return {
            ...this.attributes,
        };
    }
}