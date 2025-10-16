// Entities
import { Offer, OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";
import { Producer } from "@/core/entities/aggregates/producer";

export interface OfferAndDetailsProps extends OfferProps {
  product: Product;
  farm: Producer;
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
