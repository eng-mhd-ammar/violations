import { PAYMENT_REPOSITORY } from './domain/payment.repository.js';
import { Module } from '@nestjs/common';
import { PaymentsController } from './presentation/http/payments.controller.js';
import { PaymentsService } from './application/payments.service.js';
import { PaymentPrismaRepository } from './infrastructure/payment-prisma.repository.js';

@Module({
    controllers: [
        PaymentsController,
    ],

    providers: [
        PaymentsService,

        {
            provide: PAYMENT_REPOSITORY,
            useClass: PaymentPrismaRepository,
        },
    ],
})
    
export class PaymentsModule {}