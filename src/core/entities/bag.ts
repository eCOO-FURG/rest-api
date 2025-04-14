// Entities
import { Address } from "@/core/entities/address";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Cycle } from "@/core/entities/cycle";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Order } from "@/core/entities/order";
import { User } from "@/core/entities/user";

// Types
import { Optional } from "@/core/types/optional";

// Utils
import { fixed } from "@/core/utils/fixed";

export type BagStatus = (typeof Bag.statuses)[number];
export interface BagProps extends EntityRequest {
  customer_id: UUID;
  customer?: User;

  cycle_id: UUID;
  cycle?: Cycle;

  address_id: UUID | null;
  address?: Address | null;

  subtotal: number;
  shipping: number;
  fee: number;

  code: string;
  verified: boolean;

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
    return fixed(this.props.subtotal + this.props.shipping + this.props.fee);
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

  get verified() {
    return this.props.verified;
  }

  set status(value: BagStatus) {
    this.props.status = value;
  }

  add(order: Order) {
    this.props.orders.push(order);

    this.props.subtotal = fixed(this.props.subtotal + order.subtotal);
    this.props.fee = fixed(this.props.fee + order.fee);

    this.touch();
  }

  static create(
    props: Optional<
      BagProps,
      | "status"
      | "verified"
      | "subtotal"
      | "shipping"
      | "fee"
      | "orders"
      | "address_id"
    >
  ) {
    const bag = new Bag({
      ...props,
      address_id: props.address_id ?? null,
      shipping: props.address_id ? 10 : 0,
      subtotal: props.subtotal ?? 0,
      fee: props.fee ?? 0,
      verified: props.verified ?? false,
      status: props.status ?? "PENDING",
      orders: props.orders ?? [],
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
