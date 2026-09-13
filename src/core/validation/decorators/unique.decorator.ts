import { ValidationOptions, registerDecorator } from 'class-validator';
import { UniqueValidator } from '../validators/unique.validator.js';

export function Unique(model: string, columns: string | string[], ignoreId?: string | number, validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName) => {
        registerDecorator({
            name: 'Unique',
            target: object.constructor,
            propertyName: propertyName as string,
            constraints: [
                model,
                columns,
                ignoreId,
            ],
            options: validationOptions,
            validator: UniqueValidator,
        });
    };
}