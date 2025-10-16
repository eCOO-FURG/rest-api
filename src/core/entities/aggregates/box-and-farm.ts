// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxAndFarmProps extends BoxProps {
  farm: FarmAndAdmin;
}

export class BoxAndFarm extends Box<BoxAndFarmProps> {
  get farm() {
    return this.props.farm;
  }

  static create(props: Optional<BoxAndFarmProps, "orders">) {
    return new BoxAndFarm({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
