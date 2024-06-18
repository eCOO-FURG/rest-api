// Entities
import { Order } from "@/core/entities/order";

export interface OrdersRepository {
  findByOfferId(offer_id: string): Promise<Order | null>;
  create(order: Order): Promise<void>;
}
