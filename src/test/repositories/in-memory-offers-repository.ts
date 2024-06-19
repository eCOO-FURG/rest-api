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
  ) {}

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
      id: offer.id,
      farm_id: offer.farm_id,
      description: offer.description,
      price: offer.price,
      amount: offer.amount,
      cycle,
      product,
      delivered_at: offer.delivered_at,
      created_at: offer.created_at,
      updated_at: offer.updated_at,
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
    created_at,
  }: OffersRepositorySearchManyRequest): Promise<Offer[]> {
    const offers = this.items.filter(
      (item) =>
        item.farm_id.equals(farm_id) &&
        item.cycle_id.equals(cycle_id) &&
        item.created_at >= created_at
    );
    return offers;
  }

  async create(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    this.items[index] = offer;
  }
}
