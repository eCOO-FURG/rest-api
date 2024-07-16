import { UUID } from "@/core/entities/value-objects/uuid";

// Entities
import { Offer } from "@/core/entities/offer";
import { OfferWithProductAndCycle } from "@/core/entities/value-objects/offer-with-product-and-cycle";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchManyRequest,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";
import { InMemoryCyclesRepository } from "@/test/repositories/in-memory-cycles-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  constructor(
    private inMemoryProductsRepository: InMemoryProductsRepository,
    private inMemoryCyclesRepository: InMemoryCyclesRepository
  ) { }

  async findById(id: string): Promise<Offer | null> {
    const item = this.items.find((item) => item.id.equals(id));

    if (!item) {
      return null;
    }

    return item;
  }

  async findByIdWithProductAndCycle(
    id: string
  ): Promise<OfferWithProductAndCycle | null> {
    const offer = this.items.find((offer) => offer.id.equals(id));

    if (!offer) return null;

    const product = await this.inMemoryProductsRepository.findById(
      offer.product_id.value
    );

    if (!product) return null;
    const cycle = await this.inMemoryCyclesRepository.findById(
      offer.cycle_id.value
    );

    if (!cycle) return null;

    const offerWithProduct = OfferWithProductAndCycle.create({
      ...offer.props,
      cycle,
      product,
    });

    return offerWithProduct;
  }

  async search({
    cycle_id,
    product_id,
    farm_id,
    created_at,
  }: OffersRepositorySearchRequest): Promise<Offer | null> {
    const offer = this.items.find(
      (item) =>
        item.farm_id.equals(farm_id) &&
        item.product_id.equals(product_id) &&
        item.cycle_id.equals(cycle_id) &&
        item.created_at >= created_at
    );

    if (!offer) return null;

    return offer;
  }

  async searchMany({
    farm_id,
    cycle_id,
    page,
    product,
    created_at,
  }: OffersRepositorySearchManyRequest): Promise<OfferWithProductAndCycle[]> {
    const products = this.inMemoryProductsRepository.items.filter((item) =>
      item.name.includes(product ?? "")
    );

    const productsIds = products.map((product) => product.id);

    const offers = this.items.filter(
      (item) =>
        item.farm_id.equals(farm_id) &&
        item.cycle_id.equals(cycle_id) &&
        item.created_at >= created_at &&
        productsIds.some((id) => id.equals(item.product_id))
    );

    const completeOffers = offers.map((offer) => {
      const product = this.inMemoryProductsRepository.items.findIndex(
        (item) => item.id.equals(offer.product_id.value)
      );

      const cycle = this.inMemoryCyclesRepository.items.findIndex((item) => item.id.equals(offer.cycle_id));

      const offerWithProduct = OfferWithProductAndCycle.create({
        ...offer.props,
        cycle: this.inMemoryCyclesRepository.items[cycle],
        product: this.inMemoryProductsRepository.items[product],
      });

      return offerWithProduct;
    })

    if (!page) return completeOffers;

    const start = (page - 1) * 20;
    const end = start + 20;

    return completeOffers.slice(start, end);
  }

  async create(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    this.items[index] = offer;
  }

  async delete(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index < 0) return;

    this.items.splice(index, 1);
  }
}
