import { Module } from "@nestjs/common";
import { CurrenciesModule } from "./currencies/currencies.module.js";

@Module({
    imports: [
        CurrenciesModule,
    ],
})
    
export class PaymentsModule {}