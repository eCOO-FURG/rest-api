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
            id: offer.id,
            amount: offer.amount,
            cycle_id: offer.cycle.id,
            delivered_at: offer.delivered_at,
            description: offer.description,
            farm_id: offer.farm_id,
            price: offer.price,
            product: offer.product,
            created_at: offer.created_at,
            updated_at: offer.updated_at,
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

  async update(order: Order): Promise<Order> {
    const { amount } = this.items.get(order.id.value) as Order;

    if (this.items.get(order.id.value)) {
      const offer = await this.inMemoryOffersRepository.findById(
        order.offer_id.value
      );
      if (!offer) throw new Error("Offer not found");

      const amountDifference = Math.abs(amount - order.amount);
      offer.amount -= amountDifference;
      await this.inMemoryOffersRepository.update(offer);
    }

    this.items.set(order.id.value, order);

    return order;
  }
}
