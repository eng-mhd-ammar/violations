import { Module } from "@nestjs/common";
import { CurrenciesModule } from "./currencies/currencies.module.js";
import { PaymentsModule as PaymentRecordsModule } from "./payments/payments.module.js";

@Module({
    imports: [
        CurrenciesModule,
        PaymentRecordsModule,
    ],
})
    
export class PaymentsModule {}