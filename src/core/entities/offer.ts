// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Product } from "@/core/entities/product";
import { Catalog } from "@/core/entities/catalog";
import { Optional } from "@/core/types/optional";

// Utils
import { now } from "@/core/utils/now";

export interface OfferProps extends EntityRequest {
  catalog_id: UUID;
  catalog?: Catalog;

  product_id: UUID;
  product?: Product;

  price: number;
  fee: number;
  amount: number;

  recurring: boolean;
  active: boolean;

  description: string | null;
  comment: string | null;

  closes_at: Date;
  expires_at: Date | null;
}

export class Offer<Props extends OfferProps = OfferProps> extends Entity<Props> {
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
    return this.props.price + this.props.fee;
  }

  get description() {
    return this.props.description;
  }

  get comment() {
    return this.props.comment;
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

  get recurring() {
    return this.props.recurring;
  }

  get closes_at() {
    return this.props.closes_at;
  }

  set closes_at(closes_at: Date) {
    this.props.closes_at = closes_at;
  }

  set recurring(recurring: boolean) {
    this.props.recurring = recurring;
  }

  get active() {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
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

  set comment(comment: string | null) {
    this.props.comment = comment;
  }

  set expires_at(value: Date | null) {
    this.props.expires_at = value;
  }

  get expired() {
    return !this.props.active || (this.props.expires_at && this.props.expires_at < now());
  }

  static create(props: Optional<OfferProps, "description" | "expires_at" | "recurring" | "active" | "comment">) {
    const offer = new Offer({
      ...props,
      recurring: props.recurring ?? false,
      active: props.active ?? true,
      description: props.description ?? null,
      comment: props.comment ?? null,
      expires_at: props.expires_at ?? null,
    });

    return offer;
  }
}
