// Entities
import { Order } from "@/core/entities/order";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items = new Map<Order["id"]["value"], Order>();

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async findByOfferId(offer_id: string): Promise<Order | null> {
    const item = this.items.get(offer_id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyWithOfferByOffersIds(
    offers_ids: string[]
  ): Promise<OrderWithOffer[]> {
    const orders = Array.from(this.items.values()).filter((item) =>
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

  async create(order: Order): Promise<void> {
    const offer = await this.inMemoryOffersRepository.findById(
      order.offer_id.value
    );

    if (!offer) return;

    this.items.set(order.id.value, order);

    offer.amount -= order.amount;

    await this.inMemoryOffersRepository.update(offer);
  }

  async updateMany(orders: Order[]): Promise<void> {
    orders.forEach((order) => {
      this.items.set(order.id.value, order);
    });
  }
}
