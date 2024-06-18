// Entities
import { Order } from "@/core/entities/order";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async findByOfferId(offer_id: string): Promise<Order | null> {
    const item = this.items.find((item) => item.offer_id.equals(offer_id));

    if (!item) {
      return null;
    }

    return item;
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
}
