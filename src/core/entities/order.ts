// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/value-objects/uuid";

interface OrderProps extends EntityRequest {
  user_id: UUID;
  offer_id: UUID;
  amount: number;
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

  static create(props: OrderProps) {
    const order = new Order(props);
    return order;
  }
}
