import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min} from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';

export class UpdateUserDto {
    @UniqueNotDeleted('User', 'username', route('id'))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username?: string;

    @UniqueNotDeleted('User', 'phone',  route('id'))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'phone must be a valid phone number',
    })
    phone?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    lastName?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Exists('Branch', 'id')
    @IsOptional()
    @IsInt()
    branchId?: number | null;
}   
