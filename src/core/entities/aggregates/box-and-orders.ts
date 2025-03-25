// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

// Types
import { Optional } from "@/core/types/optional";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

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
