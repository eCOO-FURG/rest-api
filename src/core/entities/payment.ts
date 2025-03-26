// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Bag } from "@/core/entities/bag";
import { UUID } from "@/core/entities/aggregates/uuid";

// Types
import { Optional } from "@/core/types/optional";

export type PaymentStatus = (typeof Payment.statuses)[number];
export type PaymentMethod = (typeof Payment.methods)[number];
export type PaymentFlag = (typeof Payment.flags)[number];

export interface PaymentProps extends EntityRequest {
  bag_id: UUID;
  bag?: Bag;

  status: PaymentStatus;
  method: PaymentMethod;
  flag: PaymentFlag | null;
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

  static create(props: Optional<PaymentProps, "status" | "flag">) {
    const payment = new Payment({
      ...props,
      status: props.status ?? "PENDING",
      flag: props.flag ?? null,
    });

    return payment;
  }

  static statuses = ["PENDING", "DONE", "FAILED", "REFUNDED"] as const;
  static methods = ["CREDIT", "DEBIT", "CASH", "PIX"] as const;
  static flags = ["MASTERCARD", "VISA", "OTHER"] as const;
}
