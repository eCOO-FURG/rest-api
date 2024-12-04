// Entities
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";

export class InMemoryCatalogsRepository implements CatalogsRepository {
  items: Catalog[] = [];

  constructor(
    private inMemoryFarmsRepository: InMemoryFarmsRepository,
    private inMemoryOffersRepository: InMemoryOffersRepository
  ) {}

  async find(
    type: RepositoryResponse,
    { id, before, cycle, farm, offers, since }: CatalogsRepositorySearchRequest
  ): Promise<Catalog | null> {
    const catalog = await find<Catalog>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!before || item.created_at < before) &&
        (!since || item.created_at > since) &&
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!farm?.id || item.farm_id.equals(farm.id)) &&
        Boolean(!farm?.name || item?.farm?.name.includes(farm.name)) &&
        (!offers?.product?.name ||
          item.offers.some((offer) =>
            offer.product?.name.includes(offers?.product?.name!)
          ))
    );

    if (!catalog) return null;

    if (type === "basic") return catalog;

    const _farm = await this.inMemoryFarmsRepository.find("basic", {
      id: catalog.farm_id.value,
    });

    if (!_farm) return null;

    if (type === "aggregate")
      return Catalog.create({ ...catalog.props, farm: _farm });

    const _offers = await this.inMemoryOffersRepository.list(
      "basic",
      {
        catalog: { id: catalog.id.value },
        product: { name: offers?.product?.name },
      },
      offers?.page
    );

    return Catalog.create({ ...catalog.props, farm: _farm, offers: _offers });
  }

  async list(
    type: RepositoryResponse,
    { before, cycle, farm, offers, since }: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<Catalog[]> {
    let catalogs = await filter<Catalog>(
      this.items,
      async (item) =>
        (!before || item.created_at < before) &&
        (!since || item.created_at > since) &&
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!farm?.id || item.farm_id.equals(farm.id)) &&
        Boolean(!farm?.name || item?.farm?.name.includes(farm.name)) &&
        (!offers?.product?.name ||
          item.offers.some((offer) =>
            offer.product?.name.includes(offers?.product?.name!)
          ))
    );

    if (page) catalogs = this.slice(catalogs, page);

    if (type === "basic") return catalogs;

    for (const [index, catalog] of catalogs.entries()) {
      const _farm = await this.inMemoryFarmsRepository.find("basic", {
        id: catalog.farm_id.value,
      });

      if (!_farm) continue;

      catalogs[index] = Catalog.create({ ...catalog.props, farm: _farm });
    }

    if (type === "aggregate") return catalogs;

    for (const [index, catalog] of catalogs.entries()) {
      const _offers = await this.inMemoryOffersRepository.list(
        "basic",
        {
          catalog: { id: catalog.id.value },
          product: { name: offers?.product?.name },
        },
        offers?.page
      );

      catalogs[index] = Catalog.create({ ...catalog.props, offers: _offers });
    }

    return catalogs;
  }

  async update(catalog: Catalog): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(catalog.id));
    this.items[index] = catalog;
  }

  async create(catalog: Catalog): Promise<void> {
    this.items.push(catalog);
  }

  private slice(items: Catalog[], page: number, size: number = 20): Catalog[] {
    const start = (page - 1) * size;
    const end = start + size;
    return items.slice(start, end);
  }
}
