// Entities
import { Order } from "@/core/entities/order";
import { OrderAndOffer } from "@/core/entities/aggregates/order-and-offer";

// Repositories
import {
  OrdersRepository,
  OrdersRepositorySearchRequest,
  OrderRepositoryReturnType,
  OrderEntityOf,
} from "@/core/repositories/orders-repository";

// Factories
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async find<T extends OrderRepositoryReturnType>(
    type: T,
    { id, bag, offer, since, before }: OrdersRepositorySearchRequest
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

    switch (type) {
      default:
        return order as OrderEntityOf<T>;
      case "order-and-offer":
        return OrderAndOffer.create({
          ...order.props,
          offer: makeOfferAndDetails(order.offer),
        }) as OrderEntityOf<T>;
    }
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));
    this.items[index] = order;
  }
}
