// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Optional } from "@/core/types/optional";
import { Bag } from "@/core/entities/bag";

export interface PaymentProps extends EntityRequest {
  status: "PENDING" | "DONE" | "FAILED" | "REFUNDED";
  method: "CREDIT" | "DEBIT" | "CASH" | "PIX";
  flag: "MASTERCARD" | "VISA" | "OTHER" | null;
  expires_at: Date | null;

  bag_id: UUID;
  bag?: Bag;
}

export class Payment extends Entity<PaymentProps> {
  get bag_id() {
    return this.props.bag_id;
  }

  get bag() {
    return this.props.bag;
  }

  get method() {
    return this.props.method;
  }

  set method(method: PaymentProps["method"]) {
    this.props.method = method;
  }

  get status() {
    return this.props.status;
  }

  set status(status: PaymentProps["status"]) {
    this.props.status = status;
  }

  get flag() {
    return this.props.flag;
  }

  set flag(flag: PaymentProps["flag"]) {
    this.props.flag = flag;
  }

  get expires_at() {
    return this.props.expires_at;
  }

  get expired() {
    return this.expires_at && this.expires_at < new Date();
  }

  refund() {
    if (this.status !== "DONE") {
      return;
    }
    this.status = "REFUNDED";
  }  

  static create(
    props: Optional<PaymentProps, "status" | "flag" | "expires_at">
  ) {
    const expires_at =
      props.method === "PIX"
        ? new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
        : props.expires_at;

    const payment = new Payment({
      ...props,
      status: props.status ?? "PENDING",
      flag: props.flag ?? null,
      expires_at: expires_at ?? null,
    });

    return payment;
  }

}
