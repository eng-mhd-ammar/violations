import {
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

import { RouteResolver } from '../../http/helpers/route.helper.js';

import { UniqueNotDeletedValidator } from '../validators/unique-not-deleted.validator.js';

export function UniqueNotDeleted(
    model: string,
    columns: string | string[],
    ignoreId?: RouteResolver,
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object, propertyName) => {
        registerDecorator({
            name: 'UniqueNotDeleted',
            target: object.constructor,
            propertyName: propertyName as string,
            constraints: [
                model,
                columns,
                ignoreId,
            ],
            options: validationOptions,
            validator: UniqueNotDeletedValidator,
        });
    };
}