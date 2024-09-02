// Entities
import { Offer } from "@/core/entities/offer";
import { OfferAggregate } from "@/core/entities/aggregates/offer-aggregate";

// Repositories
import {
  OffersRepository,
  OffersRepositoryResponse,
  OffersRepositorySearchManyRequest,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { RepositoryResponse } from "@/core/types/repository-response";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  constructor(private inMemoryProductsRepository: InMemoryProductsRepository) {}

  async search<T extends RepositoryResponse>(
    { id, catalog_id, product, since }: OffersRepositorySearchRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T> | null> {
    const entity = this.items.find(
      (item) =>
        (!id || item.id.equals(id)) &&
        (!catalog_id || item.catalog_id.equals(catalog_id)) &&
        (!since || item.created_at >= since) &&
        (!product ||
          !product.name ||
          (() =>
            this.inMemoryProductsRepository.items.find((element) =>
              element.name.includes(product.name!)
            ))())
    );

    if (!entity) return null;

    if (type === "entity") return entity as OffersRepositoryResponse<T>;

    const _product = await this.inMemoryProductsRepository.findById(
      entity.product_id.value
    );

    if (!_product) return null;

    const aggreagate = OfferAggregate.create({
      ...entity.props,
      product: _product,
    });

    return aggreagate as OffersRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { page, catalog_id, since }: OffersRepositorySearchManyRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T>[]> {
    let entities = this.items.filter(
      (item) =>
        (!catalog_id || item.catalog_id.equals(catalog_id)) &&
        (!since || item.created_at >= since)
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      entities = entities.slice(start, end);
    }

    if (type === "entity") return entities as OffersRepositoryResponse<T>[];

    const aggregates: OfferAggregate[] = [];

    for (const entity of entities) {
      const product = await this.inMemoryProductsRepository.findById(
        entity.product_id.value
      );

      if (!product) return [];

      const aggregate = OfferAggregate.create({
        ...entity.props,
        product,
      });

      aggregates.push(aggregate);
    }

    return aggregates as OffersRepositoryResponse<T>[];
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
