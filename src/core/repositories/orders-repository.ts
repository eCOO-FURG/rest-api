// Entities
import { Order } from "../entities/order";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OrdersRepositorySearchRequest {
  id?: string;
  ids?: string[];
  bag?: { id?: string };
  offer?: { id?: string };
  since?: Date;
  before?: Date;
}

export interface OrdersRepository {
  find(
    type: RepositoryResponse,
    filters: OrdersRepositorySearchRequest
  ): Promise<Order | null>;
  update(order: Order): Promise<void>;
}
