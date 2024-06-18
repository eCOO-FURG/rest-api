// Entities
import { Order } from "@/core/entities/order";

// Repositories
import { OrdersRepository } from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

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
