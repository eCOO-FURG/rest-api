// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryFindManyByFarmIdInCycle,
} from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async findByOfferIdAndUserId(
    offer_id: string,
    user_id: string
  ): Promise<Order | null> {
    const item = this.items.find(
      (item) => item.offer_id.equals(offer_id) && item.user_id.equals(user_id)
    );

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyWithOfferByOffersIds(
    offers_ids: string[]
  ): Promise<OrderWithOffer[]> {
    const orders = this.items.filter((item) =>
      offers_ids.includes(item.offer_id.value)
    );

    const ordersWithOffer = await Promise.all(
      orders.map(async (item) => {
        const offer =
          await this.inMemoryOffersRepository.findByIdWithProductAndCycle(
            item.offer_id.value
          );

        if (!offer) return null;

        return OrderWithOffer.create({
          id: item.id,
          amount: item.amount,
          offer: {
            ...offer.props,
            cycle_id: offer.cycle.id,
          },
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      })
    );

    const filtered = ordersWithOffer.flatMap((item) => (!!item ? [item] : []));

    return filtered;
  }

  async findManyByFarmIdInCycle({
    farm_id,
    cycle_id,
    created_at,
  }: OrdersRepositoryFindManyByFarmIdInCycle): Promise<Order[]> {
    const orders = this.items.filter((order) => {
      const offer = this.inMemoryOffersRepository.items.find((offer) =>
        order.offer_id.equals(offer.id)
      );

      if (!offer) return false;

      return (
        offer.cycle_id.equals(cycle_id) &&
        order.created_at >= created_at &&
        offer.farm_id.equals(farm_id)
      );
    });

    return orders;
  }

  async create(order: Order): Promise<void> {
    const offer = await this.inMemoryOffersRepository.findById(
      order.offer_id.value
    );

    if (!offer) return;

    this.items.push(order);

    offer.amount -= order.amount;

    await this.inMemoryOffersRepository.update(offer);
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
