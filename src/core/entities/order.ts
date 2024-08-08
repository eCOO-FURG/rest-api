// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

// Types
import { Optional } from "@/core/types/optional";

export interface OrderProps extends EntityRequest {
  offer_id: UUID;
  bag_id: UUID;
  amount: number;
  status: "PENDING" | "CANCELLED" | "RECEIVED";
}

export class Order extends Entity<OrderProps> {
  get offer_id() {
    return this.props.offer_id;
  }

  get bag_id() {
    return this.props.bag_id;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  set status(value: OrderProps["status"]) {
    this.props.status = value;
  }

  static create(props: Optional<OrderProps, "status">) {
    const order = new Order({ ...props, status: props.status ?? "PENDING" });
    return order;
  }
}
