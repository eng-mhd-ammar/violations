import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class CreateObjectionDto {
    // ============================================================
    // Relations
    // ============================================================

    @IsInt()
    @IsNotEmpty()
    @Exists('Violation', 'id')
    violationId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('User', 'id')
    applicantId: number;

    @IsInt()
    @IsOptional()
    @Exists('User', 'id')
    reviewerId?: number;

    // ============================================================
    // Objection
    // ============================================================

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    reason: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 1000)
    description: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    status: string;

    // ============================================================
    // Review
    // ============================================================

    @IsString()
    @IsOptional()
    reviewedAt?: string;

    @IsString()
    @IsOptional()
    @Length(2, 1000)
    reviewNotes?: string;
}