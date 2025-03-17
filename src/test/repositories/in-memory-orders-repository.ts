// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
} from "@/core/repositories/orders-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async find(
    _: RepositoryResponse,
    { id, bag, offer, since, before }: OrdersRepositorySearchRequest
  ): Promise<Order | null> {
    const order = await find<Order>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!offer?.id || item.offer_id.equals(offer.id)) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (!order) return null;

    return order;
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items[index] = order;
  }
}
