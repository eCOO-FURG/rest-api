// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Product } from "@/core/entities/product";
import { Catalog } from "@/core/entities/catalog";
import { Optional } from "@/core/types/optional";

// Utils
import { fixed } from "@/core/utils/fixed";

export interface OfferProps extends EntityRequest {
  catalog_id: UUID;
  catalog?: Catalog;

  product_id: UUID;
  product?: Product;

  price: number;
  fee: number;
  amount: number;

  description: string | null;
  expires_at: Date | null;
}

export class Offer<
  Props extends OfferProps = OfferProps
> extends Entity<Props> {
  get price() {
    return this.props.price;
  }

  get amount() {
    return this.props.amount;
  }

  get fee() {
    return this.props.fee;
  }

  get total() {
    return fixed(this.props.price + this.props.fee);
  }

  get description() {
    return this.props.description;
  }

  get catalog_id() {
    return this.props.catalog_id;
  }

  get catalog() {
    return this.props.catalog;
  }

  get product_id() {
    return this.props.product_id;
  }

  get product() {
    return this.props.product;
  }

  get expires_at() {
    return this.props.expires_at;
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

  set expires_at(value: Date | null) {
    this.props.expires_at = value;
  }

  get expired() {
    return this.props.expires_at && this.props.expires_at < new Date();
  }

  static create(props: Optional<OfferProps, "description" | "expires_at">) {
    const offer = new Offer({
      ...props,
      description: props.description ?? null,
      expires_at: props.expires_at ?? null,
    });

    return offer;
  }
}
