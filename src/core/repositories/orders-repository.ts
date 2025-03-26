// Entities
import { Order } from "@/core/entities/order";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

export type OrderRepositoryReturnType = "order" | "order-and-offer";

export type OrderEntityOf<T extends OrderRepositoryReturnType> =
  T extends "order"
    ? Order
    : T extends "order-and-offer"
    ? OrderAndOffer
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
    filters: OrdersRepositorySearchRequest
  ): Promise<OrderEntityOf<T> | null>;
  update(order: Order): Promise<void>;
}
