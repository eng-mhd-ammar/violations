import {
    IsInt,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class UpdateRolePermissionDto {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    roleId: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    permissionId: number;
}