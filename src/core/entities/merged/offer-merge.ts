// Entities
import { Entity } from "@/core/entities/entity";
import { OfferAggregateProps } from "@/core/entities/aggregates/offer-aggregate";
import { CatalogAggregate } from "../aggregates/catalog-aggregate";

export interface OfferMergeProps
  extends Omit<OfferAggregateProps, "catalog_id"> {
  catalog: CatalogAggregate;
}

export class OfferMerge extends Entity<OfferMergeProps> {
  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get catalog() {
    return this.props.catalog;
  }

  get product() {
    return this.props.product;
  }

  static create(props: OfferMergeProps) {
    const offer = new OfferMerge(props);
    return offer;
  }
}
