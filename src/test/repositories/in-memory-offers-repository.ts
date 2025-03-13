// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";
import { find } from "@/test/utils/find";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async list(
    _: RepositoryResponse,
    { id, catalog, product, since, before }: OffersRepositorySearchRequest,
    page?: number
  ): Promise<Offer[]> {
    let offers = await filter<Offer>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (page) offers = paginate(offers, page);

    return offers;
  }

  async find(
    _: RepositoryResponse,
    { id, catalog, product, since, before }: OffersRepositorySearchRequest
  ): Promise<Offer | null> {
    const offer = await find<Offer>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (!offer) return null;

    return offer;
  }

  async delete(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    if (index === -1) return;

    this.items.splice(index, 1);
  }
}
