// Entities
import { Order } from "@/core/entities/order";

export interface OrdersRepository {
  create(order: Order): Promise<void>;
}
