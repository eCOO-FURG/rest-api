// Entities
import { Catalog, CatalogProps } from "@/core/entities/catalog";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

// Types
import { Optional } from "@/core/types/optional";

export interface CatalogAndFarmProps extends CatalogProps {
  farm: FarmAndAdmin;
}

export class CatalogAndFarm extends Catalog<CatalogAndFarmProps> {
  get farm() {
    return this.props.farm;
  }

  static create(props: Optional<CatalogAndFarmProps, "offers">) {
    return new CatalogAndFarm({
      ...props,
      offers: props.offers ?? [],
    });
  }
}
