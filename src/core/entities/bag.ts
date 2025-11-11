// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Cycle } from "@/core/entities/cycle";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Order } from "@/core/entities/order";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";
import { Market } from "./market";
import { randomCode } from "../utils/random-code";

export type BagStatus = (typeof Bag.statuses)[number];

export interface BagProps extends EntityRequest {
  customer_id: UUID;
  customer?: User;

  cycle_id: UUID | null;
  cycle?: Cycle;

  market_id: UUID | null;
  market?: Market;

  address_id: UUID | null;
  address?: Address | null;

  code: string;
  subtotal: number;
  shipping: number;
  fee: number;

  status: BagStatus;

  orders: Order[];
}

export class Bag<Props extends BagProps = BagProps> extends Entity<Props> {
  get customer() {
    return this.props.customer;
  }

  get cycle() {
    return this.props.cycle;
  }

  get address() {
    return this.props.address;
  }

  get status() {
    return this.props.status;
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

  get customer_id() {
    return this.props.customer_id;
  }

  get address_id() {
    return this.props.address_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get market_id() {
    return this.props.market_id;
  }

  get market() {
    return this.props.market;
  }

  set status(value: BagStatus) {
    this.props.status = value;
  }

  include(order: Order) {
    this.props.orders.push(order);

    this.props.subtotal = this.props.subtotal + order.subtotal;
    this.props.fee = this.props.fee + order.fee;

    this.touch();
  }

  static create(
    props: Optional<
      BagProps,
      | "status"
      | "subtotal"
      | "shipping"
      | "fee"
      | "orders"
      | "address_id"
      | "cycle_id"
      | "market_id"
      | "code"
    >,
  ) {
    const bag = new Bag({
      ...props,
      address_id: props.address_id ?? null,
      shipping: props.address_id ? 10 : 0,
      subtotal: props.subtotal ?? 0,
      fee: props.fee ?? 0,
      status: props.status ?? "PENDING",
      cycle_id: props.cycle_id ?? null,
      market_id: props.market_id ?? null,
      code: props.code ?? randomCode(),
      orders: props.orders ?? [],
    });

    return bag;
  }

  static statuses = [
    "CANCELLED",
    "PENDING",
    "VERIFIED",
    "MOUNTED",
    "DISPATCHED",
    "RECEIVED",
    "DEFERRED",
  ] as const;
}
