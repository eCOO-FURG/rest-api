// Entities
import { Order } from "@/core/entities/order";
import { OrderAggregate } from "@/core/entities/aggregates/order-aggregate";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryResponse,
  OrdersRepositorySearchManyRequest,
} from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { filter } from "@/core/utils/filter";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async searchMany<T extends RepositoryResponse = "entity">(
    { since, offers_ids, offer, bag_id }: OrdersRepositorySearchManyRequest,
    type: T
  ): Promise<OrdersRepositoryResponse<T>[]> {
    const orders = await filter<Order>(
      this.items,
      async (item) =>
        (!since || item.created_at >= since) &&
        (!offers_ids || offers_ids.includes(item.offer_id.value)) &&
        (!bag_id || item.bag_id.equals(bag_id)) &&
        (!offer ||
          !!(await this.inMemoryOffersRepository.search(
            { catalog: { id: offer.catalog_id } },
            "entity"
          )))
    );

    if (type === "entity") return orders as OrdersRepositoryResponse<T>[];

    const aggreagates: OrderAggregate[] = [];

    for (const order of orders) {
      const offer = await this.inMemoryOffersRepository.search(
        { id: order.offer_id.value },
        "aggregate"
      );

      if (!offer) return [];

      aggreagates.push(
        OrderAggregate.create({
          ...order.props,
          offer,
        })
      );
    }

    return aggreagates as OrdersRepositoryResponse<T>[];
  }

  async createMany(orders: Order[]): Promise<void> {
    for (const order of orders) {
      const offer = await this.inMemoryOffersRepository.search(
        {
          id: order.offer_id.value,
        },
        "entity"
      );

      if (!offer) return;

      this.items.push(order);
      offer.amount -= order.amount;
      await this.inMemoryOffersRepository.update(offer);
    }
  }

  async updateMany(orders: Order[]): Promise<void> {
    for (const order of orders) {
      const itemIndex = this.items.findIndex((item) =>
        item.id.equals(order.id)
      );
      this.items[itemIndex] = order;
    }
  }
}
