// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Optional } from "@/core/types/optional";

export interface PaymentProps extends EntityRequest {
  bag_id: UUID;
  status: "PENDING" | "DONE" | "FAILED";
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  flag: "MASTERCARD" | "VISA" | "OTHER" | null;
}

export class Payment extends Entity<PaymentProps> {
  get bag_id() {
    return this.props.bag_id;
  }

  get method() {
    return this.props.method;
  }

  get status() {
    return this.props.status;
  }

  get flag() {
    return this.props.flag;
  }

  static create(props: Optional<PaymentProps, "status" | "flag">) {
    const payment = new Payment({
      ...props,
      status: props.status ?? "PENDING",
      flag: props.flag ?? null,
    });
    return payment;
  }
}
