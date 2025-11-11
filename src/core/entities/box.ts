// Entities
import { Entity, EntityRequest } from "@/core/entities/entity";
import { UUID } from "@/core/entities/aggregates/uuid";
import { Cycle } from "@/core/entities/cycle";
import { Farm } from "@/core/entities/farm";
import { Order } from "@/core/entities/order";

// Types
import { Optional } from "@/core/types/optional";

export type BoxStatus = (typeof Box.statuses)[number];

export interface BoxProps extends EntityRequest {
  farm_id: UUID;
  farm?: Farm;

  cycle_id: UUID;
  cycle?: Cycle;

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
