import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class UpdateObjectionDto {
    // ============================================================
    // Relations
    // ============================================================

    @IsInt()
    @IsOptional()
    @Exists('Violation', 'id')
    violationId?: number;

    @IsInt()
    @IsOptional()
    @Exists('User', 'id')
    applicantId?: number;

    @IsInt()
    @IsOptional()
    @Exists('User', 'id')
    reviewerId?: number;

    // ============================================================
    // Objection
    // ============================================================

    @IsOptional()
    @IsString()
    @Length(2, 100)
    reason?: string;

    @IsOptional()
    @IsString()
    @Length(2, 1000)
    description?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    status?: string;

    // ============================================================
    // Review
    // ============================================================

    @IsOptional()
    @IsString()
    reviewedAt?: string;

    @IsOptional()
    @IsString()
    @Length(2, 1000)
    reviewNotes?: string;
}