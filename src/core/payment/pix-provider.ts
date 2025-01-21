// Entities
import { Payment } from "@/core/entities/payment";
import { Bag } from "@/core/entities/bag";

import { ChargeRefund } from "@woovi/node-sdk/dist/clients/charge-refund/commonTypes";

export interface RefundRequest {
  payment_id: string;
  bag: Bag
}

export interface PixProvider {
  charge(payment: Payment): Promise<{ qrcode: string; code: string }>;
  refund({ payment_id, bag }: RefundRequest): Promise<ChargeRefund>
}
