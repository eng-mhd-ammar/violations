import { Injectable } from '@nestjs/common';

import type { CookieOptions, Response as ExpressResponse } from 'express';

@Injectable()
export class ResponseUtil {
    // ---------------------------------------------------------------------------
    // 1xx Informational
    // ---------------------------------------------------------------------------

    static readonly HTTP_CONTINUE = 100;
    static readonly HTTP_SWITCHING_PROTOCOLS = 101;
    static readonly HTTP_PROCESSING = 102;
    static readonly HTTP_EARLY_HINTS = 103;

    // ---------------------------------------------------------------------------
    // 2xx Success
    // ---------------------------------------------------------------------------

    static readonly HTTP_OK = 200;
    static readonly HTTP_CREATED = 201;
    static readonly HTTP_ACCEPTED = 202;
    static readonly HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
    static readonly HTTP_NO_CONTENT = 204;
    static readonly HTTP_RESET_CONTENT = 205;
    static readonly HTTP_PARTIAL_CONTENT = 206;
    static readonly HTTP_MULTI_STATUS = 207;
    static readonly HTTP_ALREADY_REPORTED = 208;
    static readonly HTTP_IM_USED = 226;

    // ---------------------------------------------------------------------------
    // 3xx Redirection
    // ---------------------------------------------------------------------------

    static readonly HTTP_MULTIPLE_CHOICES = 300;
    static readonly HTTP_MOVED_PERMANENTLY = 301;
    static readonly HTTP_FOUND = 302;
    static readonly HTTP_SEE_OTHER = 303;
    static readonly HTTP_NOT_MODIFIED = 304;
    static readonly HTTP_USE_PROXY = 305;
    static readonly HTTP_RESERVED = 306;
    static readonly HTTP_TEMPORARY_REDIRECT = 307;
    static readonly HTTP_PERMANENT_REDIRECT = 308;

    // ---------------------------------------------------------------------------
    // 4xx Client Errors
    // ---------------------------------------------------------------------------

    static readonly HTTP_BAD_REQUEST = 400;
    static readonly HTTP_UNAUTHORIZED = 401;
    static readonly HTTP_PAYMENT_REQUIRED = 402;
    static readonly HTTP_FORBIDDEN = 403;
    static readonly HTTP_NOT_FOUND = 404;
    static readonly HTTP_METHOD_NOT_ALLOWED = 405;
    static readonly HTTP_NOT_ACCEPTABLE = 406;
    static readonly HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
    static readonly HTTP_REQUEST_TIMEOUT = 408;
    static readonly HTTP_CONFLICT = 409;
    static readonly HTTP_GONE = 410;
    static readonly HTTP_LENGTH_REQUIRED = 411;
    static readonly HTTP_PRECONDITION_FAILED = 412;
    static readonly HTTP_REQUEST_ENTITY_TOO_LARGE = 413;
    static readonly HTTP_REQUEST_URI_TOO_LONG = 414;
    static readonly HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
    static readonly HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    static readonly HTTP_EXPECTATION_FAILED = 417;
    static readonly HTTP_I_AM_A_TEAPOT = 418;
    static readonly HTTP_MISDIRECTED_REQUEST = 421;
    static readonly HTTP_UNPROCESSABLE_ENTITY = 422;
    static readonly HTTP_LOCKED = 423;
    static readonly HTTP_FAILED_DEPENDENCY = 424;
    static readonly HTTP_TOO_EARLY = 425;
    static readonly HTTP_UPGRADE_REQUIRED = 426;
    static readonly HTTP_PRECONDITION_REQUIRED = 428;
    static readonly HTTP_TOO_MANY_REQUESTS = 429;
    static readonly HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
    static readonly HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

    // ---------------------------------------------------------------------------
    // 5xx Server Errors
    // ---------------------------------------------------------------------------

    static readonly HTTP_INTERNAL_SERVER_ERROR = 500;
    static readonly HTTP_NOT_IMPLEMENTED = 501;
    static readonly HTTP_BAD_GATEWAY = 502;
    static readonly HTTP_SERVICE_UNAVAILABLE = 503;
    static readonly HTTP_GATEWAY_TIMEOUT = 504;
    static readonly HTTP_VERSION_NOT_SUPPORTED = 505;
    static readonly HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506;
    static readonly HTTP_INSUFFICIENT_STORAGE = 507;
    static readonly HTTP_LOOP_DETECTED = 508;
    static readonly HTTP_NOT_EXTENDED = 510;
    static readonly HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511;

    // ---------------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------------

    constructor(private readonly response: ExpressResponse) {}

    // ---------------------------------------------------------------------------
    // Success
    // ---------------------------------------------------------------------------

    success<T>(collection: T | null = null, message: string | null = null, code: number = ResponseUtil.HTTP_OK, resName: string = 'data', headers: Record<string, string> = {}, cookies: ResponseCookie[] = []): ExpressResponse {
        const response: Record<string, unknown> = {
            status: true,
            message: message !== null? this.title(message): null,
            [resName]: collection,
        };

        return this.send(response, code, headers, cookies);
    }

    // ---------------------------------------------------------------------------
    // Error
    // ---------------------------------------------------------------------------

    error(message: string | null = null, code: number = ResponseUtil.HTTP_NOT_FOUND, headers: Record<string, string> = {}, cookies: ResponseCookie[] = []): ExpressResponse {
        const isNotInternalError = code !== ResponseUtil.HTTP_INTERNAL_SERVER_ERROR;

        const response = {
            status: false,
            message: message ? isNotInternalError ? this.title(message) : message : 'Something Went Wrong'
        };

        return this.send(response, code, headers, cookies);
    }

    // ---------------------------------------------------------------------------
    // Errors
    // ---------------------------------------------------------------------------

    errors(messages: Record<string, string | string[]> = {}, code: number = ResponseUtil.HTTP_UNPROCESSABLE_ENTITY, headers: Record<string, string> = {}, cookies: ResponseCookie[] = []): ExpressResponse {
        const isNotInternalError = code !== ResponseUtil.HTTP_INTERNAL_SERVER_ERROR;

        const translatedMessages: Record<string, string | string[]> = {};

        for (const [key, value] of Object.entries(messages)) {
            if (Array.isArray(value)) {
                translatedMessages[key] = value.map((message) => isNotInternalError? this.title(message): message);
            } else {
                translatedMessages[key] = isNotInternalError? this.title(value): value;
            }
        }

        const response = {
            status: false,
            errors: translatedMessages,
        };

        return this.send(response, code, headers, cookies);
    }

    // ---------------------------------------------------------------------------
    // Download
    // ---------------------------------------------------------------------------

    download(path: string, name?: string): void {
        if (name !== undefined) {
            this.response.download(path, name);
            return;
        }

        this.response.download(path);
    }

    // ---------------------------------------------------------------------------
    // Cookie
    // ---------------------------------------------------------------------------

    cookie(name: string, value: string, options: CookieOptions = {}): this {
        this.response.cookie(name, value, options);
        return this;
    }

    // ---------------------------------------------------------------------------
    // Send
    // ---------------------------------------------------------------------------

    private send(body: unknown, code: number, headers: Record<string, string>, cookies: ResponseCookie[]): ExpressResponse {
        for (const [key, value] of Object.entries(headers)) {
            this.response.setHeader(key, value);
        }

        for (const cookie of cookies) {
            this.response.cookie(cookie.name, cookie.value, cookie.options ?? {});
        }

        return this.response.status(code).json(body);
    }

    // ---------------------------------------------------------------------------
    // Title
    // ---------------------------------------------------------------------------

    private title(value: string): string {
        return value
            .trim()
            .toLowerCase()
            .replace(
                /\b\w/g,
                (character) => character.toUpperCase(),
            );
    }
}   

//-----------------------------------------------------------------------------
//Cookie
//-----------------------------------------------------------------------------

export interface ResponseCookie {
    name: string;
    value: string;
    options?: CookieOptions;
}   