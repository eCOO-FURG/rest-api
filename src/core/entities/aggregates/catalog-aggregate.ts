// Entities
import { CatalogProps } from "@/core/entities/catalog";
import { Entity } from "@/core/entities/entity";
import { FarmAggregate } from "@/core/entities/aggregates/farm-aggregate";

export interface CatalogAggregateProps extends Omit<CatalogProps, "farm_id"> {
  farm: FarmAggregate;
}

export class CatalogAggregate extends Entity<CatalogAggregateProps> {
  get farm() {
    return this.props.farm;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  static create(props: CatalogAggregateProps) {
    const catalog = new CatalogAggregate(props);
    return catalog;
  }
}
