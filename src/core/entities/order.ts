// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

// Types
import { Optional } from "../types/optional";

export interface OrderProps extends EntityRequest {
  user_id: UUID;
  offer_id: UUID;
  amount: number;
  status: "pending" | "cancelled" | "complete";
}

export class Order extends Entity<OrderProps> {
  get user_id() {
    return this.props.user_id;
  }

  get offer_id() {
    return this.props.offer_id;
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
    const order = new Order({ ...props, status: props.status || "pending" });
    return order;
  }
}
