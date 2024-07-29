// Entities
import { Entity } from "@/core/entities/entity";
import { OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";

interface OfferAggregateProps extends Omit<OfferProps, "product_id"> {
  product: Product;
}

export class OfferAggregate extends Entity<OfferAggregateProps> {
  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get farm_id() {
    return this.props.farm_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get product() {
    return this.props.product;
  }

  static create(props: OfferAggregateProps) {
    const offer = new OfferAggregate(props);
    return offer;
  }
}
