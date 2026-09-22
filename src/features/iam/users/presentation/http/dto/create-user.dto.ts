import {IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    @UniqueNotDeleted('User', 'username')
    username: string;

    @UniqueNotDeleted('User', 'phone')
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{8,15}$/, {
        message: 'phone must be a valid phone number',
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    lastName: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Exists('Branch', 'id')
    @IsOptional()
    @IsInt()
    branchId?: number;
    
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @Exists('Role', 'id', { each: true })
    roles?: number[];
}
