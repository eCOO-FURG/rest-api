// Entities
import { Order } from "@/core/entities/order";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
  OrderRepositoryReturnType,
  OrderEntityOf,
} from "@/core/repositories/orders-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: OrderEntityOf<OrderRepositoryReturnType>[] = [];

  async find<T extends OrderRepositoryReturnType>(
    _: T,
    { id, bag, offer, since, before }: OrdersRepositorySearchRequest,
  ): Promise<OrderEntityOf<T> | null> {
    const order = this.items.find((item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!bag?.id || item.bag_id.equals(bag.id)) &&
        (!offer?.id || item.offer_id.equals(offer.id)) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (!order) return null;

    return order as OrderEntityOf<T>;
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items[index] = order;
  }
}
