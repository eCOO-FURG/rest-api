// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Cycle } from "@/core/entities/cycle";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Order } from "@/core/entities/order";
import { Payment } from "@/core/entities/payment";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";

export const BAG_STATUSES = [
  "PENDING",
  "SEPARATED",
  "DISPATCHED",
  "RECEIVED",
  "CANCELLED",
  "DEFERRED",
] as const;

export interface BagProps extends EntityRequest {
  code: string;
  price: number;
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

  get price() {
    return this.props.price;
  }

  set price(value: number) {
    this.props.price = value;
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

  paid() {
    const payments = Array.from(this.props.payments.values());

    for (const payment of payments) {
      if (payment.status === "DONE") return payment;
    }

    return false;
  }

  open() {
    const payments = Array.from(this.props.payments.values());

    for (const payment of payments) {
      if (payment.status === "PENDING" && !payment.expired) return payment;
    }

    return false;
  }

  verified() {
    for (const order of this.props.orders.values()) {
      if (order.status === "PENDING") return false;
    }

    return true;
  }

  add(order: Order) {
    this.props.orders.set(order.id.value, order);
    this.props.price += order.price;
    this.touch();
  }

  static create(
    props: Optional<
      BagProps,
      "price" | "status" | "address" | "orders" | "payments"
    >
  ) {
    const bag = new Bag({
      ...props,
      price: props.price ?? 0,
      status: props.status ?? "PENDING",
      orders: props.orders ?? new Map(),
      payments: props.payments ?? new Map(),
    });

    return bag;
  }
}
