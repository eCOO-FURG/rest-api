// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Order } from "@/core/entities/order";
import { Catalog } from "@/core/entities/catalog";

// Types
import { Optional } from "@/core/types/optional";

export type BoxStatus = (typeof Box.statuses)[number];
export interface BoxProps extends EntityRequest {
  catalog_id: UUID;
  catalog?: Catalog;

  status: BoxStatus;

  orders: Order[];
}

export class Box<Props extends BoxProps = BoxProps> extends Entity<Props> {
  get status() {
    return this.props.status;
  }

  set status(value: BoxProps["status"]) {
    this.props.status = value;
  }

  get orders() {
    return this.props.orders;
  }

  set orders(value: Order[]) {
    this.props.orders = value;
  }

  get catalog_id() {
    return this.props.catalog_id;
  }

  get catalog() {
    return this.props.catalog;
  }

  static create(props: Optional<BoxProps, "status" | "orders">) {
    const box = new Box({
      ...props,
      status: props.status ?? "PENDING",
      orders: props.orders ?? [],
    });

    return box;
  }

  static statuses = ["PENDING", "VERIFIED"] as const;
}
