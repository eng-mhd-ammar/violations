import { IsNotEmpty, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueNotDeleted } from '../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { UpdateAddressDto } from '../../../../locations/addresses/presentation/http/dto/update-address.dto.js';
import { route } from '../../../../../core/http/helpers/route.helper.js';

export class UpdateBranchDto {
    @UniqueNotDeleted('Branch', 'name', route("id"))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name?: string;

    @UniqueNotDeleted('Branch', 'code', route("id"))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    code?: string;

    @UniqueNotDeleted('Branch', 'phone', route("id"))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'phone must be a valid phone number',
    })
    phone?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateAddressDto)
    address?: UpdateAddressDto;
}