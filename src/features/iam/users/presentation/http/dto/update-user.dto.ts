import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username?: string;

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

    @IsOptional()
    @IsInt()
    @Min(1)
    branchId?: number | null;
}   
