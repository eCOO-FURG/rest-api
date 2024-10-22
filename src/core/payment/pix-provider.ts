// Entities
import { PaymentAggregate } from "@/core/entities/aggregates/payment-aggregate";

export interface PixProvider {
  charge(payment: PaymentAggregate): Promise<void>;
}
