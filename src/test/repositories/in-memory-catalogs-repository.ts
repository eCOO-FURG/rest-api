// Entities
import { Catalog } from "@/core/entities/catalog";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";
// Repositories
import {
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
  CatalogRepositoryReturnType,
  CatalogEntityOf,
} from "@/core/repositories/catalogs-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

// Factories
import { makeFarm } from "@/test/factories/make-farm";
import { makeUser } from "@/test/factories/make-user";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";

export class InMemoryCatalogsRepository implements CatalogsRepository {
  items: Catalog[] = [];

  async find<T extends CatalogRepositoryReturnType>(
    type: T,
    { id, before, cycle, farm, offers, since }: CatalogsRepositorySearchRequest
  ): Promise<CatalogEntityOf<T> | null> {
    const catalog = this.items.find((item) =>
      Boolean(
        (!id || item.id.equals(id)) &&
          (!before || item.created_at < before) &&
          (!since || item.created_at > since) &&
          (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
          (!farm?.id || item.farm_id.equals(farm.id)) &&
          (!farm?.name || item?.farm?.name.includes(farm.name)) &&
          (!offers?.id || item.offers.some((o) => o.id.equals(offers.id!))) &&
          (!offers?.product?.name ||
            item.offers.some((offer) =>
              offer.product?.name.includes(offers?.product?.name!)
            ))
      )
    );

    if (!catalog) return null;

    switch (type) {
      default:
        return catalog as CatalogEntityOf<T>;
      case "catalog-and-farm":
        const farm = catalog.farm ?? makeFarm();

        return CatalogAndFarm.create({
          ...catalog.props,
          farm: FarmAndAdmin.create({
            ...farm.props,
            admin: farm.admin ?? makeUser(),
          }),
        }) as CatalogEntityOf<T>;
    }
  }

  async list<T extends CatalogRepositoryReturnType>(
    type: T,
    { before, cycle, farm, offers, since }: CatalogsRepositorySearchRequest,
    page?: number
  ): Promise<CatalogEntityOf<T>[]> {
    let catalogs = this.items.filter((item) =>
      Boolean(
        (!before || item.created_at < before) &&
          (!since || item.created_at > since) &&
          (!cycle?.id || item.cycle_id.equals(cycle.id)) &&
          (!farm?.id || item.farm_id.equals(farm.id)) &&
          (!farm?.name || item?.farm?.name.includes(farm.name)) &&
          (!offers?.id || item.offers.some((o) => o.id.equals(offers.id!))) &&
          (!offers?.product?.name ||
            item.offers.some((offer) =>
              offer.product?.name.includes(offers?.product?.name!)
            ))
      )
    );

    if (page) catalogs = paginate(catalogs, page);

    switch (type) {
      default:
        return catalogs as CatalogEntityOf<T>[];
      case "catalog-and-farm":
        return catalogs.map((catalog) => {
          return CatalogAndFarm.create({
            ...catalog.props,
            farm: makeFarmAndAdmin(catalog.farm),
          }) as CatalogEntityOf<T>;
        });
    }
  }

  async update(catalog: Catalog): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(catalog.id));
    this.items[index] = catalog;
  }

  async create(catalog: Catalog): Promise<void> {
    this.items.push(catalog);
  }
}
