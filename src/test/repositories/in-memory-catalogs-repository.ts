// Entities
import { CatalogAggregate } from "@/core/entities/aggregates/catalog-aggregate";
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogsRepository,
  CatalogsRepositoryResponse,
  CatalogsRepositorySearchManyRequest,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";
import { InMemoryFarmsRepository } from "@/test/repositories/in-memory-farms-repository";
import { InMemoryOffersRepository } from "@/test/repositories/in-memory-offers-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/core/utils/find";
import { filter } from "@/core/utils/filter";
import { CatalogMerge } from "@/core/entities/merged/catalog-merge";

export class InMemoryCatalogsRepository implements CatalogsRepository {
  items: Catalog[] = [];

  constructor(
    private inMemoryFarmsRepository: InMemoryFarmsRepository,
    private inMemoryOffersRepository: InMemoryOffersRepository
  ) {}

  async search<T extends RepositoryResponse>(
    { id, cycle, farm, offer, since, before }: CatalogsRepositorySearchRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T> | null> {
    const catalog = await find<Catalog>(
      this.items,
      async (item) =>
        (!id || item.id.equals(id)) &&
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!farm?.name ||
          !!(await this.inMemoryFarmsRepository.search(
            { id: item.farm_id.value, name: farm.name },
            "entity"
          ))) &&
        (!offer?.product?.name ||
          !!(await this.inMemoryOffersRepository.search(
            {
              catalog: { id: item.id.value },
              product: { name: offer.product.name },
            },
            "entity"
          ))) &&
        (!farm?.id || item.farm_id.equals(farm.id)) &&
        (!since || item.created_at >= since) &&
        (!before || item.created_at < before)
    );

    if (!catalog) return null;

    if (type === "entity") return catalog as CatalogsRepositoryResponse<T>;

    const _farm = await this.inMemoryFarmsRepository.search(
      { id: catalog.farm_id.value },
      "aggregate"
    );

    if (!_farm) return null;

    const aggregate = CatalogAggregate.create({
      ...catalog.props,
      farm: _farm,
    });

    if (type === "aggregate") return aggregate as CatalogsRepositoryResponse<T>;

    const offers = await this.inMemoryOffersRepository.searchMany(
      {
        catalog: { id: catalog.id.value },
        product: { name: offer?.product?.name },
        page: offer?.page,
      },
      "aggregate"
    );

    const merge = CatalogMerge.create({ ...aggregate.props, offers });

    return merge as CatalogsRepositoryResponse<T>;
  }

  async searchMany<T extends RepositoryResponse>(
    { cycle, offer, page, since }: CatalogsRepositorySearchManyRequest,
    type: T
  ): Promise<CatalogsRepositoryResponse<T>[]> {
    let catalogs = await filter<Catalog>(
      this.items,
      async (item) =>
        (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
        (!since || item.created_at >= since) &&
        (!offer?.product?.name ||
          !!(await this.inMemoryOffersRepository.search(
            {
              catalog: { id: item.id.value },
              product: { name: offer.product.name },
            },
            "entity"
          )))
    );

    if (page) {
      const start = (page - 1) * 20;
      const end = start + 20;
      catalogs = catalogs.slice(start, end);
    }

    if (type === "entity") return catalogs as CatalogsRepositoryResponse<T>[];

    const aggregates: CatalogAggregate[] = [];

    for (const catalog of catalogs) {
      const farm = await this.inMemoryFarmsRepository.search(
        { id: catalog.farm_id.value },
        "aggregate"
      );

      if (!farm) return [];

      aggregates.push(CatalogAggregate.create({ ...catalog.props, farm }));
    }

    return aggregates as CatalogsRepositoryResponse<T>[];
  }

  async create(catalog: Catalog): Promise<void> {
    this.items.push(catalog);
  }
}
