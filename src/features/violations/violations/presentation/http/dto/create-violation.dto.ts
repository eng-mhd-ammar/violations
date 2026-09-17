import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateViolationDto {
    // ============================================================
    // Violation
    // ============================================================

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    @UniqueNotDeleted('Violation', 'violationNumber')
    violationNumber: string;

    // ============================================================
    // Relations
    // ============================================================

    @IsInt()
    @IsNotEmpty()
    @Exists('Citizen', 'id')
    citizenId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('ViolationType', 'id')
    violationTypeId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('Branch', 'id')
    branchId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('User', 'id')
    officerId: number;

    @IsInt()
    @IsOptional()
    @Exists('Currency', 'id')
    paidCurrencyId: number;

    // ============================================================
    // Vehicle Snapshot
    // ============================================================

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateNumber: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateCode: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateCategory: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    vehicleType: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    make: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    model: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    color: string;

    @IsInt()
    @IsNotEmpty()
    manufactureYear: string;

    // ============================================================
    // Fine
    // ============================================================

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    status: string;

    @IsNumber()
    @IsNotEmpty()
    fineAmount: number;

    // ============================================================
    // Date / Location
    // ============================================================

    @IsString()
    @IsNotEmpty()
    violationDate: string;

    @IsString()
    @IsOptional()
    @Length(2, 500)
    location: string;

    @IsString()
    @IsOptional()
    cancelledAt?: string;
}