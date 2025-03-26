// Entities
import { BagAndDetails } from "@/core/entities/aggregates/bag-and-details";
import { Payment } from "@/core/entities/payment";

export interface PixProvider {
  charge(bag: BagAndDetails): Promise<{ qrcode: string; code: string }>;
  refund(payment: Payment): Promise<void>;
}
