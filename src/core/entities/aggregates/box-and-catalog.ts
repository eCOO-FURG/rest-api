// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxAndCatalogProps extends BoxProps {
  catalog: CatalogAndFarm;
}

export class BoxAndCatalog extends Box<BoxAndCatalogProps> {
  get catalog() {
    return this.props.catalog;
  }

  static create(props: Optional<BoxAndCatalogProps, "orders">) {
    return new BoxAndCatalog({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
