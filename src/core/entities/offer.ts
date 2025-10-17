// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Product } from "@/core/entities/product";
import { Farm } from "@/core/entities/farm";
import { Cycle } from "@/core/entities/cycle";
import { Market } from "@/core/entities/market";

// Utils
import { now } from "@/core/utils/now";

// Types
import { Optional } from "@/core/types/optional";

export interface OfferProps extends EntityRequest {
  farm_id: UUID;
  farm?: Farm;

  cycle_id: UUID | null;
  cycle?: Cycle;

  market_id: UUID | null;
  market?: Market;

  product_id: UUID;
  product?: Product;

  price: number;
  amount: number;

  active: boolean;

  description: string | null;
  comment: string | null;

  opens_at: Date;
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

  get description() {
    return this.props.description;
  }

  get opens_at() {
    return this.props.opens_at;
  }

  set opens_at(opens_at: Date) {
    this.props.opens_at = opens_at;
  }

  get comment() {
    return this.props.comment;
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

  get market_id() {
    return this.props.market_id;
  }

  get market() {
    return this.props.market;
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

  exclusive(to: "MARKET" | "CYCLE"): boolean {
    if (to === "MARKET") {
      return Boolean(this.props.market_id && !this.props.cycle_id);
    } else {
      return Boolean(!this.props.market_id && this.props.cycle_id);
    }
  }

  get available() {
    return (
      this.props.amount > 0 &&
      this.props.active &&
      this.props.opens_at <= now() &&
      (!this.props.expires_at || this.props.expires_at > now()) &&
      (!this.props.closes_at || this.props.closes_at > now())
    );
  }

  static create(
    props: Optional<
      OfferProps,
      "description" | "expires_at" | "active" | "comment" | "closes_at" | "opens_at"
    >,
  ) {
    const offer = new Offer({
      ...props,
      active: props.active ?? true,
      description: props.description ?? null,
      comment: props.comment ?? null,
      expires_at: props.expires_at ?? null,
      opens_at: props.opens_at ?? now(),
      closes_at: props.closes_at ?? null,
    });

    return offer;
  }
}
