import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreatePaymentDto {

    @UniqueNotDeleted("Payment", 'receiptNumber')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    receiptNumber: string;

    @IsInt()
    @IsNotEmpty()
    @Exists('User', 'id')
    accountantId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('Branch', 'id')
    branchId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('Violation', 'id')
    violationId: number;

    @IsInt()
    @IsNotEmpty()
    @Exists('Currency', 'id')
    currencyId: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    status: string;

    @IsString()
    @IsNotEmpty()
    paidAt: string;

    @IsString()
    @IsOptional()
    @Length(2, 1000)
    notes?: string;

}