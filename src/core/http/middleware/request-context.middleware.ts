import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import type {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    runWithRequest,
} from '../helpers/route.helper.js';

@Injectable()
export class RequestContextMiddleware
    implements NestMiddleware
{
    use(
        request: Request,
        response: Response,
        next: NextFunction,
    ): void {
        runWithRequest(
            request,
            next,
        );
    }
}