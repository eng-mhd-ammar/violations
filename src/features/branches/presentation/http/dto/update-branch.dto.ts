import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Exists } from '../../../../../core/validation/decorators/exists.decorator.js';
import { UniqueNotDeleted } from '../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../core/http/helpers/route.helper.js';

export class UpdateBranchDto {
    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    @Exists('Address', 'id')
    addressId: number;

    @IsOptional()
    @UniqueNotDeleted('Branch', 'name', route('id'))
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @IsOptional()
    @UniqueNotDeleted('Branch', 'code', route('id'))
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    code: string;
    
    @IsOptional()
    @UniqueNotDeleted('Branch', 'phone', route('id'))
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'phone must be a valid phone number',
    })
    phone: string;
}