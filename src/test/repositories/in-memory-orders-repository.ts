// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
} from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { filter } from "@/test/utils/filter";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async list<T extends RepositoryResponse>(
    type: T,
    { bag, box, status }: OrdersRepositorySearchRequest,
    page?: number
  ): Promise<Order[]> {
    let orders = await filter<Order>(
      this.items,
      async (item) =>
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!box?.id || item.box_id.equals(box.id)) &&
        (!status || item.status === status)
    );

    if (page) orders = this.slice(orders, page);

    if (type === "basic") return orders;

    for (const [index, order] of orders.entries()) {
      const offer = await this.inMemoryOffersRepository.find(type, {
        id: order.offer_id.value,
      });

      if (!offer) continue;

      orders[index] = Order.create({ ...order.props, offer });
    }

    return orders;
  }

  async count(filters: OrdersRepositorySearchRequest): Promise<number> {
    const entities = await this.list("basic", filters);

    return entities.length;
  }

  private slice(items: Order[], page: number, size: number = 20): Order[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
