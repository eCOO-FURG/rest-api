// Entities
import { Order } from "@/core/entities/order";
import { OrderAggregate } from "@/core/entities/value-objects/order-aggregate";
import { OfferAggregate } from "@/core/entities/value-objects/offer-aggregate";
import { OrderWithOffer } from "@/core/entities/value-objects/order-with-offer";

// Repositories
import {
  OrdersRepository,
  OrdersRepositoryFindManyByFarmIdInCycle,
  OrdersRepositoryManyResponse,
} from "@/core/repositories/orders-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(
    private inMemoryOffersRepository: InMemoryOffersRepository,
    private inMemoryProductsRepository: InMemoryProductsRepository
  ) {}

  async findManyByOfferIdAndUserId(
    offers_ids: string[],
    user_id: string
  ): Promise<Order[]> {
    const orders = this.items.filter((order) =>
      offers_ids.some(
        (id) => order.offer_id.equals(id) && order.user_id.equals(user_id)
      )
    );
    return orders;
  }

  async findManyWithOfferByOffersIds(
    offers_ids: string[]
  ): Promise<OrderWithOffer[]> {
    const orders = this.items.filter((item) =>
      offers_ids.includes(item.offer_id.value)
    );

    const merged: OrderWithOffer[] = [];

    for (const order of orders) {
      const offer = this.inMemoryOffersRepository.items.find((item) =>
        item.id.equals(order.offer_id)
      );

      if (offer) {
        const product = this.inMemoryProductsRepository.items.find((item) =>
          item.id.equals(offer.product_id)
        );

        if (product) {
          const orderWithOffer = OrderWithOffer.create({
            ...order.props,
            offer: {
              ...offer.props,
              product,
            },
          });

          merged.push(orderWithOffer);
        }
      }
    }

    return merged;
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

  async createMany(orders: Order[]): Promise<void> {
    for (const order of orders) {
      const offer = await this.inMemoryOffersRepository.findById(
        order.offer_id.value
      );

      if (offer) {
        this.items.push(order);
        offer.amount -= order.amount;
        await this.inMemoryOffersRepository.update(offer);
      }
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

  async findManyByBagId<T extends RepositoryResponse = "entity">(
    bag_id: string,
    type = "entity" as T
  ): Promise<OrdersRepositoryManyResponse<T>> {
    const orders = this.items.filter((item) => item.bag_id.equals(bag_id));

    if (type === "entity") return orders as OrdersRepositoryManyResponse<T>;

    const aggregates: OrderAggregate[] = [];

    for (const order of orders) {
      const offer = await this.inMemoryOffersRepository.findById(
        order.offer_id.value
      );

      if (!offer) continue;

      const product = this.inMemoryProductsRepository.items.find((item) =>
        item.id.equals(offer.product_id)
      );

      if (!product) continue;

      aggregates.push(
        OrderAggregate.create({
          ...order.props,
          offer: OfferAggregate.create({ ...offer.props, product }),
        })
      );
    }

    return aggregates as OrdersRepositoryManyResponse<T>;
  }
}
