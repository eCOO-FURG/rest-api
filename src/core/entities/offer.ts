// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";

// Types
import { Optional } from "@/core/types/optional";
import { UUID } from "@/core/entities/aggregates/uuid";

export interface OfferProps extends EntityRequest {
  price: number;
  amount: number;
  description: string | null;
  catalog_id: UUID;
  product_id: UUID;
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

  get catalog_id() {
    return this.props.catalog_id;
  }

  get product_id() {
    return this.props.product_id;
  }

  set price(price: number) {
    this.props.price = price;
  }

  set amount(amount: number) {
    this.props.amount = amount;
  }

  set description(description: string | null) {
    this.props.description = description;
  }

  static create(props: Optional<OfferProps, "description">) {
    const offer = new Offer({
      ...props,
      description: props.description ?? null,
    });

    return offer;
  }
}
