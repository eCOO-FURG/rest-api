// Entities
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";
import { Catalog } from "@/core/entities/catalog";

// Repositories
import {
  CatalogEntityOf,
  CatalogRepositoryReturnType,
  CatalogsRepository,
  CatalogsRepositorySearchRequest,
} from "@/core/repositories/catalogs-repository";

// Utils
import { paginate } from "@/test/utils/paginate";

// Factories
import { CatalogAndOffers } from "@/core/entities/aggregates/catalog-and-offers";
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";
import { makeOfferAndDetails } from "@/test/factories/make-offer-and-details";

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
        return CatalogAndFarm.create({
          ...catalog.props,
          farm: makeFarmAndAdmin(catalog.farm),
        }) as CatalogEntityOf<T>;
      case "catalog-and-offers":
        return CatalogAndOffers.create({
          ...catalog.props,
          farm: makeFarmAndAdmin(catalog.farm),
          offers: catalog.offers.map((offer) => makeOfferAndDetails(offer)),
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
            )) &&
          (!offers?.product?.category?.id ||
            item.offers.some((offer) =>
              offer.product?.category?.id.equals(offers?.product?.category?.id!)
            )) &&
          (!offers?.expired ||
            (typeof offers?.expired === "boolean" &&
              (offers.expired
                ? item.offers.some((offer) => offer.expires_at! <= new Date())
                : item.offers.some((offer) => offer.expires_at! > new Date()))))
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
      case "catalog-and-offers":
        return catalogs.map((catalog) => {
          return CatalogAndOffers.create({
            ...catalog.props,
            farm: makeFarmAndAdmin(catalog.farm),
            offers: catalog.offers.map((offer) => makeOfferAndDetails(offer)),
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
