// Entities
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";

// Types
import { RepositoryResponse } from "@/core/types/repository-response";

// Utils
import { find } from "@/test/utils/find";
import { filter } from "@/test/utils/filter";
import { paginate } from "@/test/utils/paginate";

export class InMemoryCatalogsRepository implements CatalogsRepository {
  items: Catalog[] = [];

  async find(
    _: RepositoryResponse,
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
        (!offers?.id || item.offers.has(offers.id)) &&
        (!offers?.product?.name ||
          Array.from(item.offers.values()).some((offer) =>
            offer.product?.name.includes(offers?.product?.name!)
          ))
    );

    if (!catalog) return null;

    if (offers?.page) catalog.offers = paginate(catalog.offers, offers.page);

    return catalog;
  }

  async list(
    _: RepositoryResponse,
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
        (!offers?.id || item.offers.has(offers.id)) &&
        (!offers?.product?.name ||
          Array.from(item.offers.values()).some((offer) =>
            offer.product?.name.includes(offers?.product?.name!)
          ))
    );

    if (page) catalogs = paginate(catalogs, page);

    if (offers?.page) catalogs = paginate(catalogs, offers.page);

    return catalogs;
  }

  async update(catalog: Catalog): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(catalog.id));
    this.items[index] = catalog;
  }

  async create(catalog: Catalog): Promise<void> {
    this.items.push(catalog);
  }
}
