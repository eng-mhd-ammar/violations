import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ResponseUtil } from '../../../shared/utils/response.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter
{
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
    
        const response = ctx.getResponse<Response>();
    
        const status = this.getStatus(exception);
    
        const message = this.getMessage(exception);
    
        console.error(exception);
    
        if (typeof message === 'string') {
            return new ResponseUtil(response).error(
                message,
                status,
            );
        }
    
        return new ResponseUtil(response).errors(
            {
                message,
            },
            status,
        );
    }

    private getStatus(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }
        
        const error = this.asObject(exception);

        return (
            this.toNumber(error?.status) ??
            this.toNumber(error?.statusCode) ??
            this.toNumber(error?.httpStatus) ??
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private getMessage(exception: unknown): string | string[] {
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                return exceptionResponse;
            }

            if (
                this.isObject(exceptionResponse)) {
                const message = exceptionResponse.message;

                if (typeof message === 'string' || Array.isArray(message)) {
                    return message as
                        | string
                        | string[];
                }
            }

            return exception.message;
        }

        const error = this.asObject(exception);

        if (typeof error?.message === 'string') {
            return error.message;
        }

        const cause = this.asObject(error?.cause);

        if (typeof cause?.message === 'string') {
            return cause.message;
        }

        return 'An unexpected error occurred.';
    }

    private getErrors(exception: unknown): unknown {
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (this.isObject(exceptionResponse)) {
                return exceptionResponse.errors;
            }
        }

        return undefined;
    }

    private asObject(value: unknown): Record<string, unknown> | null {
        if (typeof value === 'object' && value !== null) {
            return value as Record<string, unknown>;
        }

        return null;
    }

    private isObject(value: unknown): value is Record<string, unknown> {
        return (typeof value === 'object' && value !== null);
    }

    private toNumber(value: unknown): number | undefined {
        if (typeof value === 'number') {
            return value;
        }

        return undefined;
    }
}