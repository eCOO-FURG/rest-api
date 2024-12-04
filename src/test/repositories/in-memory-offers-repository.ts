// Entities
import { Offer } from "@/core/entities/offer";

// Repositories
import {
  OffersRepository,
  OffersRepositorySearchRequest,
} from "@/core/repositories/offers-repository";
import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository";
import { RepositoryResponse } from "@/core/types/repository-response";
import { InMemoryCatalogsRepository } from "@/test/repositories/in-memory-catalogs-repository";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  public inMemoryCatalogsRepository: InMemoryCatalogsRepository;

  constructor(
    private inMemoryProductsRepository: InMemoryProductsRepository,
    inMemoryCatalogsRepository: InMemoryCatalogsRepository
  ) {
    this.inMemoryCatalogsRepository = inMemoryCatalogsRepository;
  }

  async find(
    type: RepositoryResponse,
    { id, ids, catalog, product, since, before }: OffersRepositorySearchRequest
  ): Promise<Offer | null> {
    const offer = await find<Offer>(this.items, async (item) => {
      return (
        (!id || item.id.equals(id)) &&
        (!ids || ids.includes(item.id.value)) &&
        (!catalog?.id || item.catalog_id.equals(catalog.id)) &&
        (!product?.id || item.product_id.equals(product.id)) &&
        (!product?.name || item.product?.name === product.name) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at <= before)
      );
    });

    if (!offer) return null;

    if (type === "basic") return offer;

    const _product = await this.inMemoryProductsRepository.find("basic", {
      id: offer.product_id.value,
    });

    if (!_product) return null;

    if (type === "aggregate")
      return Offer.create({ ...offer.props, product: _product });

    const _catalog = await this.inMemoryCatalogsRepository.find("basic", {
      id: offer.catalog_id.value,
    });

    if (!_catalog) return null;

    return Offer.create({
      ...offer.props,
      catalog: _catalog,
      product: _product,
    });
  }

  async list(
    type: RepositoryResponse,
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

    if (page) offers = this.slice(offers, page);

    if (type === "basic") return offers;

    for (const [index, offer] of offers.entries()) {
      const _product = await this.inMemoryProductsRepository.find("basic", {
        id: offer.product_id.value,
      });

      if (!_product) continue;

      offers[index] = Offer.create({ ...offer.props, product: _product });
    }

    if (type === "aggregate") return offers;

    for (const [index, offer] of offers.entries()) {
      const _catalog = await this.inMemoryCatalogsRepository.find("basic", {
        id: offer.catalog_id.value,
      });

      if (!_catalog) continue;

      offers[index] = Offer.create({
        ...offer.props,
        catalog: _catalog,
      });
    }

    return offers;
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

  private slice(items: Offer[], page: number, size: number = 20): Offer[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
