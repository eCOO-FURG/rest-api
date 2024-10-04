import { UUID } from "@/core/entities/aggregates/uuid";
import { Catalog } from "@/core/entities/catalog";

export function makeCatalog(props: Partial<Catalog> = {}) {
  const catalog = Catalog.create({
    id: props.id,
    cycle_id: props.cycle_id ?? new UUID(),
    farm_id: props.farm_id ?? new UUID(),
    created_at: props.created_at,
    updated_at: props.updated_at,
  });
  return catalog;
}
