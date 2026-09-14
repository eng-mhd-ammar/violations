import {
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

import { ExistsValidator } from '../validators/exists.validator.js';

export function Exists(model: string, column: string = 'id', validationOptions?: ValidationOptions): PropertyDecorator {
    return (object: object, propertyName: string | symbol) => {
        registerDecorator({
            name: 'Exists',
            target: object.constructor,
            propertyName: propertyName.toString(),
            constraints: [
                model,
                column,
            ],
            options: validationOptions,
            validator: ExistsValidator,
        });
    };
}