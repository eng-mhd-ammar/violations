import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateCurrencyDto {
    @UniqueNotDeleted('Currency', 'name')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @UniqueNotDeleted('Currency', 'code')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    code: string;
}