// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

export interface OrdersRepository {
  findByOfferId(offer_id: string): Promise<Order | null>;
  findManyWithOfferByOffersIds(offers_ids: string[]): Promise<OrderWithOffer[]>;
  create(order: Order): Promise<void>;
  updateMany(orders: Order[]): Promise<void>;
}
