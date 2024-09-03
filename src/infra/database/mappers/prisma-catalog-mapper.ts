// Entities
import { Catalog } from "@/core/entities/catalog";
import { UUID } from "@/core/entities/aggregates/uuid";

// Libraries
import { Prisma, Catalog as PrismaCatalog } from "@prisma/client";

export class PrismaCatalogMapper {
  static toDomain(raw: PrismaCatalog) {
    return Catalog.create({
      ...raw,
      id: new UUID(raw.id),
      cycle_id: new UUID(raw.cycle_id),
      farm_id: new UUID(raw.farm_id),
    });
  }

  static toPrisma(catalog: Catalog): Prisma.CatalogUncheckedCreateInput {
    return {
      ...catalog.props,
      id: catalog.id.value,
      cycle_id: catalog.cycle_id.value,
      farm_id: catalog.farm_id.value,
    };
  }
}
