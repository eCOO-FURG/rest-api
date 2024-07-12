// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

export interface OrdersRepositoryFindManyByFarmIdInCycle {
  created_at: Date;
  cycle_id: string;
  farm_id: string;
}

export interface OrdersRepository {
  findByOfferId(offer_id: string): Promise<Order | null>;
  findManyWithOfferByOffersIds(offers_ids: string[]): Promise<OrderWithOffer[]>;
  findManyByFarmIdInCycle({
    farm_id,
    cycle_id,
    created_at,
  }: OrdersRepositoryFindManyByFarmIdInCycle): Promise<Order[]>;
  create(order: Order): Promise<void>;
  updateMany(orders: Order[]): Promise<void>;
}
