// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

// Types
import { Optional } from "@/core/types/optional";
import { Producer } from "./producer";

export interface BoxAndOrdersProps extends BoxProps {
  farm: Producer;
  orders: OrderAndOffer[];
}

export class BoxAndOrders extends Box<BoxAndOrdersProps> {
  get farm() {
    return this.props.farm;
  }

  static create(props: Optional<BoxAndOrdersProps, "orders">) {
    return new BoxAndOrders({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
