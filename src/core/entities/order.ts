// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Bag } from "@/core/entities/bag";
import { Box } from "@/core/entities/box";
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Offer } from "@/core/entities/offer";
import { Optional } from "@/core/types/optional";

export type OrderStatus = (typeof Order.statuses)[number];

export interface OrderProps extends EntityRequest {
  offer_id: UUID;
  offer?: Offer;

  bag_id: UUID;
  bag?: Bag;

  box_id: UUID;
  box?: Box;

  subtotal: number;
  fee: number;
  amount: number;

  status: OrderStatus;
}

export class Order<Props extends OrderProps = OrderProps> extends Entity<Props> {
  get offer_id() {
    return this.props.offer_id;
  }

  get offer() {
    return this.props.offer;
  }

  get bag_id() {
    return this.props.bag_id;
  }

  get bag() {
    return this.props.bag;
  }

  get box_id() {
    return this.props.box_id;
  }

  get box() {
    return this.props.box;
  }

  get amount() {
    return this.props.amount;
  }

  get subtotal() {
    return this.props.subtotal;
  }

  get fee() {
    return this.props.fee;
  }

  get total() {
    return this.props.subtotal + this.props.fee;
  }

  set subtotal(value: number) {
    this.props.subtotal = value;
  }

  set amount(value: number) {
    this.props.amount = value;
  }

  get status() {
    return this.props.status;
  }

  set status(value: OrderProps["status"]) {
    this.props.status = value;
  }

  static create(props: Optional<OrderProps, "status">) {
    const order = new Order({
      ...props,
      status: props.status ?? "PENDING",
    });
    return order;
  }

  static statuses = ["PENDING", "CANCELLED", "RECEIVED", "REJECTED"] as const;
}
