// Entities
import { Offer, OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

export interface OfferAndDetailsProps extends OfferProps {
  product: Product;
  farm: FarmAndAdmin;
}

export class OfferAndDetails extends Offer<OfferAndDetailsProps> {
  get product() {
    return this.props.product;
  }

  get farm() {
    return this.props.farm;
  }

  static create(props: OfferAndDetailsProps) {
    return new OfferAndDetails({
      ...props,
    });
  }
}
