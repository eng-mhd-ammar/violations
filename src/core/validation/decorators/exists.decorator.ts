import {ValidationOptions, registerDecorator } from 'class-validator';
import { ExistsValidator } from '../validators/exists.validator.js';

export function Exists(model: string, column: string = 'id', validationOptions?: ValidationOptions): PropertyDecorator {
    return (object, propertyName) => {
        registerDecorator({
            name: 'Exists',
            target: object.constructor,
            propertyName: propertyName as string,
            constraints: [model, column],
            options: validationOptions,
            validator: ExistsValidator,
        });
    };
}