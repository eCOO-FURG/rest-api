// Entities
import { Entity } from "@/core/entities/entity";
import { CatalogAggregateProps } from "@/core/entities/aggregates/catalog-aggregate";
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";

interface CatalogMergeProps extends CatalogAggregateProps {
  offers: OfferAggregate[];
}

export class CatalogMerge extends Entity<CatalogMergeProps> {
  get farm() {
    return this.props.farm;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get offers() {
    return this.props.offers;
  }

  static create(props: CatalogMergeProps) {
    const catalog = new CatalogMerge(props);
    return catalog;
  }
}
