// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Optional } from "@/core/types/optional";

export interface PaymentProps extends EntityRequest {
  bag_id: UUID;
  status: "PENDING" | "DONE" | "FAILED";
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  flag: "MASTERCARD" | "VISA" | "OTHER" | null;
  expires_at: Date | null;
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

  get expires_at() {
    return this.props.expires_at;
  }

  get expired() {
    return this.expires_at && this.expires_at < new Date();
  }

  static create(
    props: Optional<PaymentProps, "status" | "flag" | "expires_at">
  ) {
    const payment = new Payment({
      ...props,
      status: props.status ?? "PENDING",
      flag: props.flag ?? null,
      expires_at: props.expires_at ?? null,
    });

    return payment;
  }
}
