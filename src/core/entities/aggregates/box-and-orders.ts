// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxAndOrdersProps extends BoxProps {
  catalog: CatalogAndFarm;
  orders: OrderAndOffer[];
}

export class BoxAndOrders extends Box<BoxAndOrdersProps> {
  get catalog() {
    return this.props.catalog;
  }

  static create(props: Optional<BoxAndOrdersProps, "orders">) {
    return new BoxAndOrders({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
