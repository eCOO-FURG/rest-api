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

  active: boolean;

  description: string | null;
  comment: string | null;

  closes_at: Date | null;
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

  get closes_at(): Date | null {
    return this.props.closes_at;
  }

  set closes_at(closes_at: Date) {
    this.props.closes_at = closes_at;
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

  get available() {
    return (
      this.props.amount > 0 &&
      this.props.active &&
      (!this.props.expires_at || this.props.expires_at > now()) &&
      (!this.props.closes_at || this.props.closes_at > now())
    );
  }

  static create(props: Optional<OfferProps, "description" | "expires_at" | "active" | "comment">) {
    const offer = new Offer({
      ...props,
      active: props.active ?? true,
      description: props.description ?? null,
      comment: props.comment ?? null,
      expires_at: props.expires_at ?? null,
    });

    return offer;
  }
}
