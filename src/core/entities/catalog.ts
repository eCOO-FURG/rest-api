// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Cycle } from "@/core/entities/cycle";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Farm } from "@/core/entities/farm";
import { Offer } from "@/core/entities/offer";

// Types
import { Optional } from "@/core/types/optional";

export interface CatalogProps extends EntityRequest {
  farm_id: UUID;
  farm?: Farm;

  cycle_id: UUID;
  cycle?: Cycle;

  fee: number;

  offers: Offer[];
}

export class Catalog<Props extends CatalogProps = CatalogProps> extends Entity<Props> {
  get fee() {
    return this.props.fee;
  }

  set fee(value: number) {
    this.props.fee = value;
  }

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

  set offers(offers: Offer[]) {
    this.props.offers = offers;
  }

  static create(props: Optional<CatalogProps, "offers">) {
    return new Catalog({
      ...props,
      offers: props.offers ?? [],
    });
  }
}
