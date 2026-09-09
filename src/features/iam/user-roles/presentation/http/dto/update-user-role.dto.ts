import {
    IsInt,
    IsOptional,
    IsPositive,
} from 'class-validator';

export class UpdateUserRoleDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    userId: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    roleId?: number;
}
