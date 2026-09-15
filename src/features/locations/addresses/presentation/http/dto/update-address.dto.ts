import {
    IsInt,
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class UpdateAddressDto {
    @IsInt()
    @IsNotEmpty()
    @Exists('State', 'id')
    stateId: number;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    city: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    street: string;
}