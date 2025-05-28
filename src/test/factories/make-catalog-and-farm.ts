// Entities
import { Catalog } from "@/core/entities/catalog";
import { CatalogAndFarm } from "@/core/entities/aggregates/catalog-and-farm";

// Factories
import { makeFarmAndAdmin } from "@/test/factories/make-farm-and-admin";
import { makeCatalog } from "@/test/factories/make-catalog";

export function makeCatalogAndFarm(catalog: Catalog = makeCatalog()) {
  return CatalogAndFarm.create({
    ...catalog.props,
    farm: makeFarmAndAdmin(catalog.farm),
  });
}
