import { IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Exists } from '../../../../../core/validation/decorators/exists.decorator.js';
import { UniqueNotDeleted } from '../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateBranchDto {
    @IsInt()
    @IsNotEmpty()
    @Exists('Address', 'id')
    addressId: number;

    @UniqueNotDeleted('Branch', 'name')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @UniqueNotDeleted('Branch', 'code')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    code: string;
    
    @UniqueNotDeleted('Branch', 'phone')
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'phone must be a valid phone number',
    })
    phone: string;
}