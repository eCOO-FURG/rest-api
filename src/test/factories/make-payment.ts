// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment, PaymentProps } from "@/core/entities/payment";

export function makePayment(props: Partial<PaymentProps> = {}) {
  return Payment.create({
    ...props,
    bag_id: props.bag_id ?? new UUID(),
    method: props.method ?? "CASH",
  });
}
