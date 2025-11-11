// Entities
import { Order, OrderProps } from "@/core/entities/order";
import { Merchandise } from "@/core/entities/aggregates/merchandise";

export interface OrderAndDetailsProps extends OrderProps {
  offer: Merchandise;
}

export class OrderAndDetails extends Order<OrderAndDetailsProps> {
  get offer() {
    return this.props.offer;
  }

  static create(props: OrderAndDetailsProps) {
    return new OrderAndDetails(props);
  }
}
