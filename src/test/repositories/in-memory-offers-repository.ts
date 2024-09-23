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
import { OfferMerge } from "@/core/entities/merged/offer-merge";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Utils
import { find } from "@/core/utils/find";
import { filter } from "@/core/utils/filter";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  public inMemoryCatalogsRepository: InMemoryCatalogsRepository;

  constructor(
    private inMemoryProductsRepository: InMemoryProductsRepository,
    inMemoryCatalogsRepository: InMemoryCatalogsRepository
  ) {
    this.inMemoryCatalogsRepository = inMemoryCatalogsRepository;
  }

  async search<T extends RepositoryResponse>(
    { id, catalog, product, since }: OffersRepositorySearchRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T> | null> {
    const entity = await find<Offer>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!since || item.created_at >= since) &&
        (!product?.name ||
          this.inMemoryProductsRepository.items.some(
            (p) =>
              p.id.equals(item.product_id) && p.name.includes(product.name!)
          ))
    );

    if (!entity) return null;

    if (type === "entity") return entity as OffersRepositoryResponse<T>;

    const _product = await this.inMemoryProductsRepository.findById(
      entity.product_id.value
    );

    if (!_product) return null;

    if (type === "aggregate") {
      return OfferAggregate.create({
        ...entity.props,
        product: _product,
      }) as OffersRepositoryResponse<T>;
    }

    const _catalog = await this.inMemoryCatalogsRepository.search(
      { id: entity.catalog_id.value },
      "aggregate"
    );

    if (!_catalog) return null;

    return OfferMerge.create({
      ...entity.props,
      product: _product,
      catalog: _catalog,
    }) as OffersRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { page, catalog, ids, product, since }: OffersRepositorySearchManyRequest,
    type: T
  ): Promise<OffersRepositoryResponse<T>[]> {
    let entities = await filter<Offer>(
      this.items,
      async (item) =>
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!since || item.created_at >= since) &&
        (!ids || ids.includes(item.id.value)) &&
        (!product?.name ||
          this.inMemoryProductsRepository.items.some(
            (p) =>
              p.id.equals(item.product_id) && p.name.includes(product.name!)
          ))
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      entities = entities.slice(start, end);
    }

    if (type === "entity") return entities as OffersRepositoryResponse<T>[];

    const results: OffersRepositoryResponse<T>[] = [];

    for (const entity of entities) {
      const _product = await this.inMemoryProductsRepository.findById(
        entity.product_id.value
      );

      if (!_product) continue;

      if (type === "aggregate") {
        const offer = OfferAggregate.create({
          ...entity.props,
          product: _product,
        }) as OffersRepositoryResponse<T>;

        results.push(offer);

        continue;
      }

      const _catalog = await this.inMemoryCatalogsRepository.search(
        { id: entity.catalog_id.value },
        "aggregate"
      );

      if (!_catalog) continue;

      const offer = OfferMerge.create({
        ...entity.props,
        product: _product,
        catalog: _catalog,
      }) as OffersRepositoryResponse<T>;

      results.push(offer);
    }

    return results;
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
