import { UUID } from "@/core/entities/aggregates/uuid";
import { Catalog, CatalogProps } from "@/core/entities/catalog";

export function makeCatalog(props: Partial<CatalogProps> = {}) {
  const catalog = Catalog.create({
    ...props,
    fee: props.fee ?? 20,
    cycle_id: props.cycle_id ?? new UUID(),
    farm_id: props.farm_id ?? new UUID(),
  });
  return catalog;
}
