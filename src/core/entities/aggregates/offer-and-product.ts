// Entities
import { Offer, OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";

// Types
import { Optional } from "@/core/types/optional";

export interface OfferAndProductProps extends OfferProps {
  product: Product;
}

export class OfferAndProduct extends Offer<OfferAndProductProps> {
  get product() {
    return this.props.product;
  }

  static create(props: OfferAndProductProps) {
    return new OfferAndProduct(props);
  }
}
