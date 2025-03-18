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

export type BagStatus = (typeof Bag.statuses)[number];
export interface BagProps extends EntityRequest {
  user_id: UUID;
  user?: User;

  cycle_id: UUID;
  cycle?: Cycle;

  address_id: UUID | null;
  address?: Address;

  subtotal: number;
  shipping: number;
  fee: number;

  code: string;
  paid: boolean;
  verified: boolean;

  status: BagStatus;

  orders: Order[];
  payments: Payment[];
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

  get subtotal() {
    return this.props.subtotal;
  }

  get fee() {
    return this.props.fee;
  }

  get shipping() {
    return this.props.shipping;
  }

  get total() {
    return this.props.subtotal + this.props.shipping + this.props.fee;
  }

  set subtotal(value: number) {
    this.props.subtotal = value;
  }

  set shipping(value: number) {
    this.props.shipping = value;
  }

  get orders() {
    return this.props.orders;
  }

  set orders(value: Order[]) {
    this.props.orders = value;
  }

  get payments() {
    return this.props.payments;
  }

  set payments(value: Payment[]) {
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

  get paid() {
    return this.props.paid;
  }

  get verified() {
    return this.props.verified;
  }

  add(order: Order) {
    this.props.orders.push(order);
    this.props.subtotal += order.price;
    this.props.fee += order.fee;
    this.touch();
  }

  static create(
    props: Optional<
      BagProps,
      | "status"
      | "address"
      | "orders"
      | "payments"
      | "address_id"
      | "paid"
      | "verified"
      | "subtotal"
      | "shipping"
      | "fee"
    >
  ) {
    const bag = new Bag({
      ...props,
      address_id: props.address_id ?? null,
      shipping: props.address_id ? 10 : 0,
      subtotal: props.subtotal ?? 0,
      fee: props.fee ?? 0,
      paid: props.paid ?? false,
      verified: props.verified ?? false,
      status: props.status ?? "PENDING",
      orders: props.orders ?? [],
      payments: props.payments ?? [],
    });

    return bag;
  }

  static statuses = [
    "PENDING",
    "SEPARATED",
    "DISPATCHED",
    "RECEIVED",
    "CANCELLED",
    "DEFERRED",
  ] as const;
}
