import {
    registerDecorator,
    ValidationOptions,
} from 'class-validator';

import {
    ExistsOrMinusOneValidator,
} from '../validators/exists-or-minus-one.validator.js';

export function ExistsOrMinusOne(
    model: string,
    column: string = 'id',
    validationOptions?: ValidationOptions,
): PropertyDecorator {

    return (
        object: object,
        propertyName: string | symbol,
    ) => {

        registerDecorator({
            name: 'ExistsOrMinusOne',
            target: object.constructor,
            propertyName: propertyName.toString(),

            constraints: [
                model,
                column,
            ],

            options: validationOptions,

            validator: ExistsOrMinusOneValidator,
        });
    };
}