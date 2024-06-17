// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositoryFindRequest,
} from "@/core/repositories/offers-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async find({
    cycle_id,
    product_id,
    farm_id,
    created_at,
  }: OffersRepositoryFindRequest): Promise<Offer | null> {
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

  async create(offer: Offer): Promise<void> {
    this.items.push(offer);
  }
}
