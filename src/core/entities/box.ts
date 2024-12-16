// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Order } from "@/core/entities/order";
import { Catalog } from "@/core/entities/catalog";

// Types
import { Optional } from "@/core/types/optional";

export interface BoxProps extends EntityRequest {
  status: "PENDING" | "VERIFIED";
  verified: number;

  catalog_id: UUID;
  catalog?: Catalog;

  orders: Map<string, Order>;
}

export class Box extends Entity<BoxProps> {
  get verified() {
    return this.props.verified;
  }

  get status() {
    return this.props.status;
  }

  set status(value: BoxProps["status"]) {
    this.props.status = value;
  }

  set verified(value: number) {
    this.props.verified = value;
  }

  get orders() {
    return this.props.orders;
  }

  set orders(value: Map<string, Order>) {
    this.props.orders = value;
  }

  get catalog_id() {
    return this.props.catalog_id;
  }

  get catalog() {
    return this.props.catalog;
  }

  static create(props: Optional<BoxProps, "verified" | "status" | "orders">) {
    const box = new Box({
      ...props,
      verified: props.verified ?? 0,
      status: props.status ?? "PENDING",
      orders: props.orders ?? new Map(),
    });

    return box;
  }
}
