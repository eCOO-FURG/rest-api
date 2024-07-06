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
  status: "pending" | "cancelled" | "received";
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

  get status() {
    return this.props.status;
  }

  set amount(amount: number) {
    this.props.amount = amount;
  }

  set price(price: number) {
    this.props.price = price;
  }

  static create(props: Optional<OfferProps, "description" | "status">) {
    const offer = new Offer({
      ...props,
      description: props.description ?? null,
      status: props.status ?? "pending",
    });

    return offer;
  }
}
