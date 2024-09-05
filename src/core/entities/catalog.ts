// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";

export interface CatalogProps extends EntityRequest {
  farm_id: UUID;
  cycle_id: UUID;
}

export class Catalog extends Entity<CatalogProps> {
  get farm_id() {
    return this.props.farm_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  static create(props: CatalogProps) {
    const catalog = new Catalog(props);
    return catalog;
  }
}
