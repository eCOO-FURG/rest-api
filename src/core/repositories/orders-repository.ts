// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";
import { OrderAggregate } from "@/core/entities/value-objects/order-aggregate";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export interface OrdersRepositoryFindManyByFarmIdInCycle {
  created_at: Date;
  cycle_id: string;
  farm_id: string;
}

export type OrdersRepositoryResponse<T extends RepositoryResponse> =
  T extends "entity" ? Order : OrderAggregate;

export type OrdersRepositoryManyResponse<T extends RepositoryResponse> =
  T extends "entity" ? Order[] : OrderAggregate[];

export interface OrdersRepository {
  findManyWithOfferByOffersIds(offers_ids: string[]): Promise<OrderWithOffer[]>;
  findManyByFarmIdInCycle({
    farm_id,
    cycle_id,
    created_at,
  }: OrdersRepositoryFindManyByFarmIdInCycle): Promise<Order[]>;
  findManyByBagId<T extends RepositoryResponse = "entity">(
    bag_id: string,
    type?: T
  ): Promise<OrdersRepositoryManyResponse<T>>;
  createMany(orders: Order[]): Promise<void>;
  updateMany(orders: Order[]): Promise<void>;
}
