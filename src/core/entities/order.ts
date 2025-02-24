// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Bag } from "@/core/entities/bag";
import { Box } from "@/core/entities/box";

// Types
import { Optional } from "@/core/types/optional";
import { Offer } from "@/core/entities/offer";

export interface OrderProps extends EntityRequest {
  amount: number;
  price: number;
  tax: number;
  status: "PENDING" | "CANCELLED" | "RECEIVED" | "REJECTED";

  offer_id: UUID;
  offer?: Offer;

  bag_id: UUID;
  bag?: Bag;

  box_id: UUID;
  box?: Box;
}

export class Order extends Entity<OrderProps> {
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

  get price() {
    return this.props.price;
  }

  set price(value: number) {
    this.props.price = value;
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

  get tax() {
    return this.props.tax;
  }

  static create(props: Optional<OrderProps, "status" | "price">) {
    const cost = props.offer?.price ?? 1;

    const price =
      props.price ?? props.offer?.product?.pricing === "WEIGHT"
        ? (cost / 1000) * props.amount
        : cost * props.amount;

    const order = new Order({
      ...props,
      price,
      status: props.status ?? "PENDING",
    });
    return order;
  }
}
