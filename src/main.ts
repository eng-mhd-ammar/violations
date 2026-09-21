import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';

import { GlobalExceptionFilter } from './core/exceptions/filters/global-exception.filter.js';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
    );

    app.enableCors({
        origin: '*',
    });

    app.set('query parser', 'extended');

    useContainer(
        app.select(AppModule),
        {
            fallback: true,
            fallbackOnErrors: true,
        },
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(
        new GlobalExceptionFilter(),
    );

    await app.listen(
        process.env.PORT ?? 3000,
    );
}

bootstrap();