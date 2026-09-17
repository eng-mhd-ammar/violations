import {IsInt,IsNotEmpty,IsNumber,IsOptional,IsString,Length } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class UpdateViolationDto {
    // ============================================================
    // Violation
    // ============================================================

    @UniqueNotDeleted('Violation', 'violationNumber', route('id'))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    violationNumber?: string;

    // ============================================================
    // Relations
    // ============================================================

    @IsInt()
    @IsOptional()
    @Exists('Citizen', 'id')
    citizenId?: number;

    @IsInt()
    @IsOptional()
    @Exists('ViolationType', 'id')
    violationTypeId?: number;

    @IsInt()
    @IsOptional()
    @Exists('Branch', 'id')
    branchId?: number;

    @IsInt()
    @IsOptional()
    @Exists('User', 'id')
    officerId?: number;

    @IsInt()
    @IsOptional()
    @Exists('Currency', 'id')
    paidCurrencyId: number;

    // ============================================================
    // Vehicle Snapshot
    // ============================================================

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateNumber?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateCode?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    plateCategory?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    vehicleType?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    make?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    model?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    color?: string;

    @IsInt()
    @IsOptional()
    manufactureYear?: string;

    // ============================================================
    // Fine
    // ============================================================

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    status?: string;

    @IsNumber()
    @IsOptional()
    fineAmount?: number;

    // ============================================================
    // Date / Location
    // ============================================================

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    violationDate?: string;

    @IsOptional()
    @IsString()
    @Length(2, 500)
    location?: string;

    @IsOptional()
    @IsString()
    cancelledAt?: string;
}