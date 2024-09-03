// Entities
import { Order } from "@/core/entities/order";
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OrdersRepositorySearchManyRequest {
  offers_ids?: string[];
  bag_id?: string;
  since?: Date;
  box?: {
    id?: string;
  };
  offer?: {
    catalog_id: string;
  };
}

export type OrdersRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Order : OrderAggregate;

export interface OrdersRepository {
  searchMany<T extends RepositoryResponse = "entity">(
    filters: OrdersRepositorySearchManyRequest,
    type: T
  ): Promise<OrdersRepositoryResponse<T>[]>;
  createMany(orders: Order[]): Promise<void>;
  updateMany(orders: Order[]): Promise<void>;
}
