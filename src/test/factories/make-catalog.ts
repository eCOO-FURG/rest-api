import { UUID } from "@/core/entities/aggregates/uuid";
import { Catalog } from "@/core/entities/catalog";

export function makeCatalog(props: Partial<Catalog> = {}) {
  const catalog = Catalog.create({
    ...props,
    cycle_id: props.cycle_id ?? new UUID(),
    farm_id: props.farm_id ?? new UUID(),
  });
  return catalog;
}
