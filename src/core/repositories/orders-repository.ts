// Entities
import { Order } from "@/core/entities/order";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OrdersRepositorySearchRequest {
  status?: Order["status"];
  bag?: { id?: string };
  box?: { id?: string };
}

export interface OrdersRepository {
  list(
    type: RepositoryResponse,
    filters: OrdersRepositorySearchRequest,
    page?: number
  ): Promise<Order[]>;
  count(filters: OrdersRepositorySearchRequest): Promise<number>;
}
