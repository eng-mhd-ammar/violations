import { IsInt, IsNotEmpty } from 'class-validator';
import { Exists } from '../../../../../../core/validation/decorators/exists.decorator.js';

export class CreateUserRoleDto {
    @Exists('User', 'id')
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @Exists('Role', 'id')
    @IsInt()
    @IsNotEmpty()
    roleId: number;
}
