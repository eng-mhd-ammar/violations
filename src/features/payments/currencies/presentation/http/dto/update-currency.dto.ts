import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';

export class UpdateCurrencyDto {
    @IsOptional()
    @UniqueNotDeleted('Currency', 'name', route('id'))
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @IsOptional()
    @UniqueNotDeleted('Currency', 'code', route('id'))
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    code: string;
}