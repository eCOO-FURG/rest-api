// Entities
import { Payment } from "@/core/entities/payment";

export interface PixProvider {
  charge(payment: Payment): Promise<{ qrcode: string; code: string }>;
}
