// Entities
import { BoxProps } from "@/core/entities/box";
import { CatalogAggregate } from "@/core/entities/aggregates/catalog-aggregate";
import { Entity } from "@/core/entities/entity";

export interface BoxAggregateProps extends Omit<BoxProps, "catalog_id"> {
  catalog: CatalogAggregate;
}

export class BoxAggregate extends Entity<BoxAggregateProps> {
  get catalog() {
    return this.props.catalog;
  }

  get verified() {
    return this.props.verified;
  }

  static create(props: BoxAggregateProps) {
    const box = new BoxAggregate(props);
    return box;
  }
}
