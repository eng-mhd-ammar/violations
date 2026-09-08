export interface UserAttributes {
    id?: number;

    username: string;
    phone: string;
    password: string;

    firstName: string;
    lastName: string;

    isActive?: boolean;
    branchId?: number | null;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export class User {
    private attributes: UserAttributes;

    constructor(attributes: UserAttributes) {
        this.attributes = {
            isActive: true,
            branchId: null,
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

    get username(): string {
        return this.attributes.username;
    }

    get phone(): string {
        return this.attributes.phone;
    }

    get password(): string {
        return this.attributes.password;
    }

    get firstName(): string {
        return this.attributes.firstName;
    }

    get lastName(): string {
        return this.attributes.lastName;
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    get isActive(): boolean {
        return this.attributes.isActive ?? true;
    }

    get branchId(): number | null {
        return this.attributes.branchId ?? null;
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
    // Mutations
    // ============================================================

    updateName(firstName: string, lastName: string): void {
        this.attributes.firstName = firstName;
        this.attributes.lastName = lastName;
    }

    changePhone(phone: string): void {
        this.attributes.phone = phone;
    }

    changeUsername(username: string): void {
        this.attributes.username = username;
    }

    changePassword(password: string): void {
        this.attributes.password = password;
    }

    activate(): void {
        this.attributes.isActive = true;
    }

    deactivate(): void {
        this.attributes.isActive = false;
    }

    assignBranch(branchId: number | null): void {
        this.attributes.branchId = branchId;
    }

    // ============================================================
    // State
    // ============================================================

    isActiveUser(): boolean {
        return this.isActive;
    }

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

  // ============================================================
  // Serialization
  // ============================================================

    toAttributes(): UserAttributes {
        return {
            ...this.attributes,
        };
    }
}