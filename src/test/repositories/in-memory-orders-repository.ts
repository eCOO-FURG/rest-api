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
import { OrderMerge } from "@/core/entities/merged/order-merge";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async searchMany<T extends RepositoryResponse>(
    { bag, box, page }: OrdersRepositorySearchManyRequest,
    type: T
  ): Promise<OrdersRepositoryResponse<T>[]> {
    let entities = await filter(
      this.items,
      async (item) =>
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!box?.id || item.box_id.equals(box.id))
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      entities = entities.slice(start, end);
    }

    if (type === "entity") return entities as OrdersRepositoryResponse<T>[];

    const results: OrdersRepositoryResponse<T>[] = [];

    for (const entity of entities) {
      if (type === "aggregate") {
        const _offer = await this.inMemoryOffersRepository.search(
          { id: entity.offer_id.value },
          "aggregate"
        );

        if (!_offer) continue;

        const order = OrderAggregate.create({
          ...entity.props,
          offer: _offer,
        }) as OrdersRepositoryResponse<T>;

        results.push(order);

        continue;
      }

      const _offer = await this.inMemoryOffersRepository.search(
        { id: entity.offer_id.value },
        "merged"
      );

      if (!_offer) continue;

      const order = OrderMerge.create({
        ...entity.props,
        offer: _offer,
      }) as OrdersRepositoryResponse<T>;

      results.push(order);
    }

    return results;
  }

  async createMany(orders: Order[]): Promise<void> {
    for (const order of orders) {
      const offer = await this.inMemoryOffersRepository.search(
        { id: order.offer_id.value },
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
