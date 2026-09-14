import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class CreateRolePermissionDto {
    @Exists('Role', 'id', { each: true })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    roleId: number;

    @Exists('Permission', 'id', { each: true })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    permissionId: number;
}