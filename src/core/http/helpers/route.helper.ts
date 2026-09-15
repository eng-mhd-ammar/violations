import { AsyncLocalStorage } from 'node:async_hooks';

import type { Request } from 'express';

const requestStorage = new AsyncLocalStorage<Request>();

export type RouteResolver = () => string | undefined;

export function runWithRequest<T>(request: Request, callback: () => T): T {
    return requestStorage.run(request, callback);
}

export function route(key: string): RouteResolver {
    return () => {
        const request = requestStorage.getStore();

        console.log('ROUTE REQUEST PARAMS:', request?.params);

        if (!request) {
            return undefined;
        }

        const value = request.params[key];

        console.log(`ROUTE PARAM [${key}]:`, value);

        if (Array.isArray(value)) {
            return value[0];
        }

        return value;
    };
}