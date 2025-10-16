// Entities
import { Box, BoxProps } from "@/core/entities/box";
import { Producer } from "@/core/entities/aggregates/producer";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxAndFarmProps extends BoxProps {
  farm: Producer;
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
