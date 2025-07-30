// Entities
import { Order } from "@/core/entities/order";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";
import { OrderAndDetails } from "@/core/entities/aggregates/order-and-details";

export type OrderRepositoryReturnType =
  | "order"
  | "order-and-offer"
  | "order-and-details";

export type OrderEntityOf<T extends OrderRepositoryReturnType> =
  T extends "order"
    ? Order
    : T extends "order-and-offer"
      ? OrderAndOffer
      : T extends "order-and-details"
        ? OrderAndDetails
        : never;

export interface OrdersRepositorySearchRequest {
  id?: string;
  ids?: string[];
  bag?: { id?: string };
  offer?: { id?: string };
  since?: Date;
  before?: Date;
}

export interface OrdersRepository {
  find<T extends OrderRepositoryReturnType>(
    type: T,
    filters: OrdersRepositorySearchRequest,
  ): Promise<OrderEntityOf<T> | null>;
  update(order: Order): Promise<void>;
}
