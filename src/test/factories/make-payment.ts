// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Payment } from "@/core/entities/payment";

export function makePayment(props: Partial<Payment> = {}) {
  return Payment.create({
    id: props.id,
    bag_id: props.bag_id ?? new UUID(),
    status: props.status,
    method: props.method ?? "CASH",
    flag: props.flag ?? null,
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
}
