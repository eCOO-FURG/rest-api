// Entities
import { Entity } from "@/core/entities/entity";
import { OfferProps } from "@/core/entities/offer";
import { Product } from "@/core/entities/product";

export interface OfferAggregateProps extends Omit<OfferProps, "product_id"> {
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

  get catalog_id() {
    return this.props.catalog_id;
  }

  get product() {
    return this.props.product;
  }

  set price(value: number) {
    this.props.price = value;
  }

  set amount(value: number) {
    this.props.amount = value;
  }

  static create(props: OfferAggregateProps) {
    const offer = new OfferAggregate(props);
    return offer;
  }
}
