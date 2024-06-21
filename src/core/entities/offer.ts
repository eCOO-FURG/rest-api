// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";
import { UUID } from "@/core/entities/value-objects/uuid";

export interface OfferProps extends EntityRequest {
  price: number;
  amount: number;
  description: string | null;
  farm_id: UUID;
  cycle_id: UUID;
  product_id: UUID;
  delivered_at: Date | null;
}

export class Offer extends Entity<OfferProps> {
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

  get product_id() {
    return this.props.product_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get delivered_at() {
    return this.props.delivered_at;
  }

  set amount(amount: number) {
    this.props.amount = amount;
  }

  set price(price: number) {
    this.props.price = price;
  }

  static create(props: Optional<OfferProps, "description" | "delivered_at">) {
    const offer = new Offer({
      ...props,
      description: props.description ?? null,
      delivered_at: props.delivered_at ?? null,
    });

    return offer;
  }
}
