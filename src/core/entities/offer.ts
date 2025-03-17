// Entities
import { UUID } from "@/core/entities/aggregates/uuid";
import { Entity, EntityRequest } from "@/core/entities/entity";
import { Product } from "@/core/entities/product";
import { Catalog } from "@/core/entities/catalog";
import { Order } from "@/core/entities/order";
import { Optional } from "@/core/types/optional";

export interface OfferProps extends EntityRequest {
  catalog_id: UUID;
  catalog?: Catalog;

  product_id: UUID;
  product?: Product;

  price: number;
  amount: number;
  description: string | null;
  expires_at: Date | null;

  orders: Order[];
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

  get catalog() {
    return this.props.catalog;
  }

  get orders() {
    return this.props.orders;
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

  static create(
    props: Optional<OfferProps, "description" | "expires_at" | "orders">
  ) {
    const offer = new Offer({
      ...props,
      description: props.description ?? null,
      expires_at: props.expires_at ?? null,
      orders: props.orders ?? [],
    });

    return offer;
  }
}
