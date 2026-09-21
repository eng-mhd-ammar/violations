import { IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class UpdatePaymentDto {

    @UniqueNotDeleted("Payment", 'receiptNumber')
    @IsOptional()
    @IsString()
    @Length(2, 100)
    receiptNumber?: string;

    @IsOptional()
    @IsInt()
    @Exists('User', 'id')
    accountantId?: number;

    @IsOptional()
    @IsInt()
    @Exists('Branch', 'id')
    branchId?: number;

    @IsOptional()
    @IsInt()
    @Exists('Violation', 'id')
    violationId?: number;

    @IsOptional()
    @IsInt()
    @Exists('Currency', 'id')
    currencyId?: number;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    status?: string;

    @IsOptional()
    @IsString()
    paidAt?: string;

    @IsOptional()
    @IsString()
    @Length(2, 1000)
    notes?: string;

}