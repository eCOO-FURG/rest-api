// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { User } from "@/core/entities/user";
import { Address } from "@/core/entities/address";
import { Cycle } from "@/core/entities/cycle";
import { Order } from "@/core/entities/order";
import { Payment } from "@/core/entities/payment";

// Types
import { Optional } from "@/core/types/optional";

export const BAG_STATUSES = [
  "PENDING",
  "SEPARATED",
  "DISPATCHED",
  "RECEIVED",
  "CANCELLED",
  "DEFERRED",
  "CANCELLED",
] as const;

export interface BagProps extends EntityRequest {
  code: string;
  status: (typeof BAG_STATUSES)[number];

  user_id: UUID;
  user?: User;

  cycle_id: UUID;
  cycle?: Cycle;

  address_id: UUID | null;
  address?: Address;

  orders: Map<string, Order>;
  payments: Map<string, Payment>;
}

export class Bag extends Entity<BagProps> {
  get user() {
    return this.props.user;
  }

  get cycle() {
    return this.props.cycle;
  }

  get status() {
    return this.props.status;
  }

  get address() {
    return this.props.address;
  }

  set status(value: BagProps["status"]) {
    this.props.status = value;
  }

  get code() {
    return this.props.code;
  }

  get orders() {
    return this.props.orders;
  }

  set orders(value: Map<string, Order>) {
    this.props.orders = value;
  }

  get payments() {
    return this.props.payments;
  }

  set payments(value: Map<string, Payment>) {
    this.props.payments = value;
  }

  get user_id() {
    return this.props.user_id;
  }

  get address_id() {
    return this.props.address_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  price() {
    const orders = this.props.orders;

    let price = 0;

    for (const order of orders.values())
      price += order.amount * (order?.offer?.price ?? 0);

    return price;
  }

  paid() {
    const payments = Array.from(this.props.payments.values());

    const done = payments.some((payment) => payment.status === "DONE");

    return done;
  }

  open() {
    const payments = Array.from(this.props.payments.values());

    const pending = payments.find(
      (payment) => payment.status === "PENDING" && !payment.expired
    );

    if (!pending) return null;

    return pending;
  }

  static create(
    props: Optional<BagProps, "status" | "address" | "orders" | "payments">
  ) {
    const bag = new Bag({
      ...props,
      status: props.status ?? "PENDING",
      orders: props.orders ?? new Map(),
      payments: props.payments ?? new Map(),
    });

    return bag;
  }
}
