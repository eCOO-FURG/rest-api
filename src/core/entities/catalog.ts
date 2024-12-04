// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Cycle } from "@/core/entities/cycle";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Offer } from "@/core/entities/offer";
import { Farm } from "@/core/entities/farm";

// Types
import { Optional } from "@/core/types/optional";

export interface CatalogProps extends EntityRequest {
  offers: Offer[];

  farm_id: UUID;
  farm?: Farm;

  cycle_id: UUID;
  cycle?: Cycle;
}

export class Catalog extends Entity<CatalogProps> {
  get farm_id() {
    return this.props.farm_id;
  }

  get farm() {
    return this.props.farm;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get cycle() {
    return this.props.cycle;
  }

  get offers() {
    return this.props.offers;
  }

  static create(props: Optional<CatalogProps, "offers">) {
    const catalog = new Catalog({ ...props, offers: props.offers ?? [] });
    return catalog;
  }
}
