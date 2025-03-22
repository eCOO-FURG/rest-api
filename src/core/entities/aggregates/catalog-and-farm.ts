// Entities
import { Catalog, CatalogProps } from "@/core/entities/catalog";
import { FarmAndAdmin } from "@/core/entities/aggregates/farm-and-admin";

export interface CatalogAndFarmProps extends CatalogProps {
  farm: FarmAndAdmin;
}

export class CatalogAndFarm extends Catalog<CatalogAndFarmProps> {
  get farm() {
    return this.props.farm;
  }

  static create(props: CatalogAndFarmProps) {
    return new CatalogAndFarm(props);
  }
}
