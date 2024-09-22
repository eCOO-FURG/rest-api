// Entities
import { Order } from "@/core/entities/order";
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";
import { OrderMerge } from "@/core/entities/merged/order-merge";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OrdersRepositorySearchManyRequest {
  bag?: {
    id?: string;
  };
  box?: {
    id?: string;
  };
  page?: number;
}

export type OrdersRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity"
    ? Order
    : T extends "aggregate"
    ? OrderAggregate
    : OrderMerge;

export interface OrdersRepository {
  searchMany<T extends RepositoryResponse = "entity">(
    filters: OrdersRepositorySearchManyRequest,
    type: T
  ): Promise<OrdersRepositoryResponse<T>[]>;
  createMany(orders: Order[]): Promise<void>;
  updateMany(orders: Order[]): Promise<void>;
}
