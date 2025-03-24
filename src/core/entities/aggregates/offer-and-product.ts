// Entities
import { Offer, OfferProps } from "../offer";
import { Product } from "../product";

// Types
import { Optional } from "@/core/types/optional";

export interface OfferAndProductProps extends OfferProps {
  product: Product;
}

export class OfferAndProduct extends Offer {
  get product() {
    return this.props.product;
  }

  static create(props: Optional<OfferAndProductProps, "orders">) {
    return new OfferAndProduct({
      ...props,
      orders: props.orders ?? [],
    });
  }
}
